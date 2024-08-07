import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

@Injectable()
export class NatsStreamingService implements OnModuleInit, OnModuleDestroy {
  private client: nats.Stan;
  private clientId: string;
  private clusterId: string;
  private nats_url: string;

  constructor() {
    this.clusterId = process.env.NATS_CLUSTER_ID;
    this.clientId =
      process.env.NATS_CLIENT_ID || randomBytes(16).toString('hex');
    this.nats_url = process.env.NATS_URL;
    this.client = nats.connect(this.clusterId, this.clientId, {
      url: this.nats_url,
      // connectTimeout: 5000, // Timeout in milliseconds
    });
    console.log('clusterId', this.clusterId);
  }

  async onModuleInit() {
    console.log('nats streaming service onModuleInit');

    try {
      await new Promise<void>((resolve, reject) => {
        this.client.on('connect', () => {
          console.log(`Connected to NATS with client ID: ${this.clientId}`);
          resolve();
        });

        this.client.on('error', (err) => {
          console.error('Error connecting to NATS', err);
          reject(err);
        });
      });
    } catch (err) {
      console.error('Failed to initialize NATS connection', err);
    }
  }

  async onModuleDestroy() {
    console.log('onModuleDestroy called, closing NATS connection...');
    await new Promise<void>((resolve) => {
      this.client.close();
      console.log('NATS connection closed');
      resolve();
    });
  }

  publish(subject: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(subject, data);

      this.client.publish(subject, JSON.stringify(data), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  subscribe(subject: string, callback: (data: any) => void) {
    const subscription = this.client.subscribe(subject);
    subscription.on('message', (msg) => {
      const data = JSON.parse(msg.getData());
      callback(data);
    });
    return subscription;
  }
}

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { EventSubject } from 'common/events/subjects';

@Injectable()
export class NatsStreamingService implements OnModuleInit, OnModuleDestroy {
  private client: nats.Stan;
  protected ackWait = 5 * 1000;
  private queueGroup: string = 'task_manager_group';
  private clientId: string;
  private clusterId: string;
  private isConnected: boolean = false;
  private connectPromise: Promise<void>;
  private nats_url: string;

  constructor() {
    this.clusterId = process.env.NATS_CLUSTER_ID;
    this.clientId = randomBytes(16).toString('hex');
    this.nats_url = process.env.NATS_URL;
    this.client = nats.connect(this.clusterId, this.clientId, {
      url: this.nats_url,
      // connectTimeout: 5000, // Timeout in milliseconds
    });
    console.log('clusterId', this.clusterId);
    this.connectPromise = this.createConnectPromise();
  }

  private createConnectPromise(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        console.log(`Connected to NATS with client ID: ${this.clientId}`);
        this.isConnected = true;
        resolve();
      });

      this.client.on('error', (err) => {
        console.error('Error connecting to NATS', err);
        reject(err);
      });
    });
  }

  async onModuleInit() {
    try {
      await this.connectPromise;
    } catch (err) {
      console.error('Failed to initialize NATS connection', err);
    }
  }

  async onModuleDestroy() {
    await new Promise<void>((resolve) => {
      this.client.close();
      console.log('NATS connection closed');
      this.isConnected = false;
      resolve();
    });
  }

  publish(subject: EventSubject, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject(new Error('NATS client is not connected'));
        return;
      }
      this.client.publish(subject, JSON.stringify(data), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroup);
  }

  subscribe(subject: EventSubject, callback: (data: any) => void) {
    if (!this.isConnected) {
      console.error('Cannot subscribe: NATS client is not connected');
      return;
    }
    const subscription = this.client.subscribe(
      subject,
      this.queueGroup,
      this.subscriptionOptions(),
    );
    subscription.on('message', (msg) => {
      callback(msg);
    });
    return subscription;
  }

  getConnectPromise(): Promise<void> {
    return this.connectPromise;
  }
}

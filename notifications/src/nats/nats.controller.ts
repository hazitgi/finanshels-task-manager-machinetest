import {
  Controller,
  Post,
  Body,
  Get,
  HttpException,
  HttpStatus,
  OnModuleInit,
} from '@nestjs/common';
import { NatsStreamingService } from './nats.service';
import { EventSubject, EventSubjects } from 'common/events/subjects';
import { SocketIoGateway } from '../socket-io/gateway';
import * as nats from 'node-nats-streaming';

@Controller('nats')
export class NatsController implements OnModuleInit {
  private readonly subjects = Object.values(EventSubjects);

  constructor(
    private readonly natsStreamingService: NatsStreamingService,
    private readonly socketIoGateway: SocketIoGateway,
  ) {}

  async onModuleInit() {
    try {
      await this.natsStreamingService.getConnectPromise();
      this.subscribeToMessages();
    } catch (err) {
      console.error('Failed to initialize NATS connection', err);
    }
  }

  @Post('publish')
  async publishMessage(
    @Body() message: { subject: EventSubject; payload: any },
  ) {
    const { subject, payload } = message;

    if (!Object.values(EventSubjects).includes(subject)) {
      throw new HttpException('Invalid subject', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.natsStreamingService.publish(subject, payload);
      return { success: true, message: `Message published to ${subject}` };
    } catch (error) {
      throw new HttpException(
        'Failed to publish message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('subscribe')
  subscribeToMessages() {
    this.subjects.forEach((subject) => {
      console.log(`Subscribing to ${subject}`);
      this.natsStreamingService.subscribe(
        subject as EventSubject,
        (msg: nats.Message) => {
          const data = JSON.parse(msg.getData() as string);
          console.log(`Received message on ${subject}:`, data);
          this.socketIoGateway.sendMessage(subject, data);
          msg.ack(); // Acknowledge the message
        },
      );
    });
    return { success: true, message: 'Subscribed to all subjects' };
  }
}

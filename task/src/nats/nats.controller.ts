import { Controller, Post, Body } from '@nestjs/common';
import { NatsStreamingService } from './nats.service';
import { EventSubjects } from 'common/events/subjects';

@Controller('nats')
export class NatsController {
  private readonly subjects = Object.values(EventSubjects); // Use your defined subjects

  constructor(private readonly natsStreamingService: NatsStreamingService) {}

  @Post()
  async publishMessage(
    @Body() message: { subject: keyof typeof EventSubjects; payload: any },
  ) {
    const { subject, payload } = message;

    // Ensure subject is valid
    if (!Object.values(EventSubjects).includes(subject)) {
      throw new Error('Invalid subject');
    }

    await this.natsStreamingService.publish(subject, payload);
    return { success: true };
  }
}

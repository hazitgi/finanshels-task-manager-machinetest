import { Module } from '@nestjs/common';
import { NatsStreamingService } from './nats.service';
import { NatsController } from './nats.controller';

@Module({
  controllers: [NatsController],
  providers: [NatsStreamingService],
  exports: [NatsStreamingService], // Ensure it is exported
})
export class NatsModule {}

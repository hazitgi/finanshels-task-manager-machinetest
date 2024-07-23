import { Module } from '@nestjs/common';
import { NatsStreamingService } from './nats.service';
import { NatsController } from './nats.controller';
import { SocketIoModule } from '../socket-io/socket-io.module';

@Module({
  imports: [SocketIoModule], // Import the module containing SocketIoGateway
  controllers: [NatsController],
  providers: [NatsStreamingService],
})
export class NatsModule {}

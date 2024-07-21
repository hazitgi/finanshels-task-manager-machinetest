import { Module } from '@nestjs/common';
import { NatsModule } from './nats/nats.module';
import { SocketIoModule } from './socket-io/socket-io.module';

@Module({
  imports: [NatsModule, SocketIoModule],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { SocketIoGateway } from './gateway';

@Module({
  providers: [SocketIoGateway],
  exports: [SocketIoGateway], // Export the provider to make it available in other modules
})
export class SocketIoModule {}

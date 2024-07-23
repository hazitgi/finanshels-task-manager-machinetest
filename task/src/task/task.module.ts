import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NatsModule } from 'src/nats/nats.module';

@Module({
  imports: [NatsModule, PrismaModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}

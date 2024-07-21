import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NatsModule } from 'src/nats/nats.module';

@Module({
  imports: [NatsModule, PrismaModule],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}

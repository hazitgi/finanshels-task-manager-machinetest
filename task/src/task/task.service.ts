import { Injectable, Logger } from '@nestjs/common';
// import { UpdateTaskDto } from './dto/update-task.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(private prisma: PrismaService) {}
  async create(taskCreateInput: Prisma.TaskCreateInput) {
    try {
      console.log('create task...`);', taskCreateInput);
      const result = await this.prisma.task.create({
        data: taskCreateInput,
      });
      return result;
    } catch (error) {
      this.logger.error(`Failed to create board: ${error.message}`);
      throw error;
    }
  }

  async findAll() {
    try {
      const boards = await this.prisma.task.findMany();
      return boards;
    } catch (error) {
      this.logger.error(`Error fetching boards: ${error.message}`);
      throw error;
    }
  }

  findOne(id: string) {
    return this.prisma.task.findUnique({ where: { id } });
  }

  update(id: string, data: Prisma.TaskUpdateInput) {
    return this.prisma.board.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.board.delete({ where: { id } });
  }
}

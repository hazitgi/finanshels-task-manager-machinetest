import { Injectable, Logger } from '@nestjs/common';
// import { UpdateTaskDto } from './dto/update-task.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(private prisma: PrismaService) {}
  async create(taskCreateInput: Prisma.TaskCreateInput) {
    console.log(taskCreateInput);

    try {
      const result = await this.prisma.task.create({
        data: taskCreateInput,
      });
      return result;
    } catch (error) {
      this.logger.error(`Failed to create board: ${error.message}`);
      throw error;
    }
  }

  async findAll(boardId: number) {
    try {
      const boards = await this.prisma.task.findMany({ where: { boardId } });
      return boards;
    } catch (error) {
      this.logger.error(`Error fetching boards: ${error.message}`);
      throw error;
    }
  }

  findOne(id: number) {
    return this.prisma.task.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.TaskUpdateInput) {
    try {
      const result = await this.prisma.task.update({ where: { id }, data });
      return result;
    } catch (error) {
      this.logger.error(`Failed to update task: ${error.message}`);
      throw error;
    }
  }

  remove(id: number) {
    return this.prisma.task.delete({ where: { id } });
  }
}

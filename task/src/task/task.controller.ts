import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';
import { CustomError } from 'common/exceptions/custom.error';
import { Prisma } from '@prisma/client';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createTaskDto: CreateTaskDto) {
    try {
      console.log('createTaskDto: ', createTaskDto);

      // Transform the DTO to match Prisma's input types if necessary
      const taskCreateInput: Prisma.TaskCreateInput = {
        ...createTaskDto,
        column: { connect: { id: createTaskDto.column } },
        board: { connect: { id: createTaskDto.board } },
        subtasks: createTaskDto.subtasks.map((subtask) => ({
          title: subtask.title,
          isCompleted: subtask.isCompleted,
        })),
      };
      console.log(taskCreateInput);

      // Call the service method to create the task
      const result = await this.taskService.create(taskCreateInput);
      return result;
    } catch (error: any) {
      if (error instanceof CustomError) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      // Call the service method to create the task
      const result = await this.taskService.findAll();
      return result;
    } catch (error: any) {
      if (error instanceof CustomError) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: Prisma.TaskUpdateInput,
  ) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }
}

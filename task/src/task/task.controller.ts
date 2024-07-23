import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';
import { CustomError } from 'common/exceptions/custom.error';
import { Prisma } from '@prisma/client';
import { UpdateTaskDto } from './dto/update-task.dto';
import { NatsStreamingService } from 'src/nats/nats.service';
import { EventSubjects } from 'common/events/subjects';

@Controller('task')
export class TaskController {
  private readonly logger = new Logger(TaskController.name);
  constructor(
    private readonly taskService: TaskService,
    private readonly natsStreamingService: NatsStreamingService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createTaskDto: CreateTaskDto) {
    console.log('>>>>>>>>>>>>>>>>>>');

    try {
      // Transform the DTO to match Prisma's input types if necessary
      console.log('createTaskDto', createTaskDto);

      const taskCreateInput: Prisma.TaskCreateInput = {
        ...createTaskDto,
        column: { connect: { id: createTaskDto.column } },
        board: { connect: { id: createTaskDto.board } },
        subtasks: createTaskDto.subtasks.map((subtask) => ({
          title: subtask.title,
          isCompleted: subtask.isCompleted,
        })),
      };

      // Call the service method to create the task
      const result = await this.taskService.create(taskCreateInput);
      this.natsStreamingService.publish(EventSubjects.TASK_CREATED, {
        data: result,
      });
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

  @Get('board/:boardId')
  async findAll(@Param('boardId') boardId: string) {
    try {
      // Call the service method to create the task
      const result = await this.taskService.findAll(+boardId);
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
    return this.taskService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    try {
      // Transform the data to ensure it's in the correct format
      const transformedData: Prisma.TaskUpdateInput = {
        ...(updateTaskDto.title && { title: updateTaskDto.title }),
        // ...(updateTaskDto.slug && { slug: updateTaskDto.slug }),
        ...(updateTaskDto.description && {
          description: updateTaskDto.description,
        }),
        ...(updateTaskDto.order !== undefined && {
          order: updateTaskDto.order,
        }),
        ...(updateTaskDto.subtasks && {
          subtasks: updateTaskDto.subtasks.map((subtask) => ({
            title: subtask.title,
            isCompleted: subtask.isCompleted,
          })),
        }),

        ...(updateTaskDto.columnId && {
          column: { connect: { id: updateTaskDto.columnId } },
        }),
        // ...(updateTaskDto.boardId && {
        //   board: { connect: { id: updateTaskDto.boardId } },
        // }),
      };

      // Call the service to perform the update
      const result = await this.taskService.update(+id, transformedData);
      this.natsStreamingService.publish(EventSubjects.TASK_UPDATED, {
        data: result,
      });
      return result;
    } catch (error: any) {
      this.logger.error(`Failed to update task: ${error.message}`);
      if (error instanceof CustomError) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Put(':id/drag')
  async drag(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    try {
      // Transform the data to ensure it's in the correct format
      const transformedData: Prisma.TaskUpdateInput = {
        ...(updateTaskDto.order !== undefined && {
          order: updateTaskDto.order,
        }),
        ...(updateTaskDto.columnId && {
          column: { connect: { id: updateTaskDto.columnId } },
        }),
      };

      // Call the service to perform the update
      const result = await this.taskService.update(+id, transformedData);
      this.natsStreamingService.publish(EventSubjects.TASK_DRAGGED, {
        data: result,
      });
      return result;
    } catch (error: any) {
      this.logger.error(`Failed to update task: ${error.message}`);
      if (error instanceof CustomError) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.taskService.remove(+id);
      this.natsStreamingService.publish(EventSubjects.TASK_REMOVED, {
        data: result,
      });
      return result;
    } catch (error: any) {
      this.logger.error(`Failed to update task: ${error.message}`);
      if (error instanceof CustomError) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

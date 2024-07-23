import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpException,
  Put,
  Logger,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { Prisma } from '@prisma/client';
import { CreateBoardDto } from './dto/create-board.dto';
import { CustomError } from 'common/exceptions/custom.error';
import { UpdateBoardDto } from './dto/update-board.dto';
import { NatsStreamingService } from 'src/nats/nats.service';
import { EventSubjects } from 'common/events/subjects';

@Controller('board')
export class BoardController {
  private readonly logger = new Logger(BoardController.name);
  constructor(
    private readonly boardService: BoardService,
    private readonly natsStreamingService: NatsStreamingService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createBoardDto: CreateBoardDto) {
    try {
      // Transform the data to ensure it's in the correct format
      const transformedData: Prisma.BoardCreateInput = {
        name: createBoardDto.name,
        slug: createBoardDto.slug,
        columns: {
          create: createBoardDto?.columns || [],
        },
      };
      const result = await this.boardService.create(transformedData);
      this.natsStreamingService.publish(EventSubjects.BOARD_CREATED, {
        data: result,
      });
      return result;
    } catch (error: any) {
      this.logger.error(`Failed to create board: ${error.message}`);
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
  findAll() {
    return this.boardService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.boardService.findOne(+id);
      return result;
    } catch (error: any) {
      this.logger.error(`Failed to find board: ${error.message}`);
      if (error instanceof CustomError) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id') id: string,
    @Body() UpdateBoardDto: UpdateBoardDto,
  ) {
    try {
      // Transform the data to ensure it's in the correct format
      const transformedData: Prisma.BoardUpdateInput = {
        ...(UpdateBoardDto.name && { name: UpdateBoardDto.name }),
        ...(UpdateBoardDto.slug && { slug: UpdateBoardDto.slug }),
        ...(UpdateBoardDto.columns && {
          columns: {
            update: UpdateBoardDto.columns.map((column) => ({
              where: { id: column?.id },
              data: {
                ...(column.name && { name: column.name }),
                ...(column.slug && { slug: column.slug }),
                ...(column.color && { color: column.color }),
              },
            })),
          },
        }),
      };

      const result = await this.boardService.update(+id, transformedData);
      this.natsStreamingService.publish(EventSubjects.BOARD_UPDATED, {
        data: result,
      });
      return result;
    } catch (error: any) {
      this.logger.error(`Failed to update board: ${error.message}`);
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
      const result = await this.boardService.remove(+id);
      this.natsStreamingService.publish(EventSubjects.BOARD_REMOVED, {
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

  @Delete(':boardId/column/:columnId')
  async deleteColumn(
    @Param('boardId') boardId: string,
    @Param('columnId') columnId: string,
  ) {
    try {
      const result = await this.boardService.removeColumn(+boardId, +columnId);
      this.natsStreamingService.publish(EventSubjects.COLUMN_REMOVED, {
        data: result,
      });
      return result;
    } catch (error: any) {
      this.logger.error(`Failed to delete column: ${error.message}`);
      if (error instanceof CustomError) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':boardId/column')
  async bordColumnWithTask(@Param('boardId') boardId: string) {
    try {
      const result = await this.boardService.findAllColumnTask(+boardId);
      return result;
    } catch (error: any) {
      this.logger.error(`Failed to delete column: ${error.message}`);
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

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
} from '@nestjs/common';
import { BoardService } from './board.service';
import { Prisma } from '@prisma/client';
import { CreateBoardDto } from './dto/create-board.dto';
import { CustomError } from 'common/exceptions/custom.error';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

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
  findAll() {
    return this.boardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardService.findOne(id);
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
              where: { id: column.id },
              data: {
                ...(column.name && { name: column.name }),
                ...(column.slug && { slug: column.slug }),
                ...(column.color && { color: column.color }),
              },
            })),
          },
        }),
      };
      const result = await this.boardService.update(id, transformedData);
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardService.remove(id);
  }
}

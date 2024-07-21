import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Board, Prisma } from '@prisma/client';
import { CustomError } from 'common/exceptions/custom.error';

@Injectable()
export class BoardService {
  private readonly logger = new Logger(BoardService.name);

  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.BoardCreateInput): Promise<Board> {
    try {
      const dataAlreadyExists = await this.prisma.board.findFirst({
        where: { slug: data.slug },
      });
      if (dataAlreadyExists) {
        throw new CustomError('Board name already exists', 'CustomError');
      }
      const result = await this.prisma.board.create({
        data: {
          name: data.name,
          slug: data.slug,
          columns: {
            create: data.columns?.create || [],
          },
        },
        include: {
          columns: true,
        },
      });
      return result;
    } catch (error) {
      this.logger.error(`Failed to create board: ${error.message}`);
      throw error;
    }
  }

  async findAll(): Promise<Board[]> {
    try {
      const boards = await this.prisma.board.findMany({
        include: {
          columns: true,
        },
      });
      this.logger.log(`Found ${boards.length} boards`);
      return boards;
    } catch (error) {
      this.logger.error(`Error fetching boards: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<Board | null> {
    try {
      const result = await this.prisma.board.findUnique({
        where: { id },
        include: { columns: true },
      });
      return result;
    } catch (error) {
      this.logger.error(`Error fetching board: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, data: Prisma.BoardUpdateInput): Promise<Board> {
    return this.prisma.board.update({
      where: { id },
      data,
      include: {
        columns: true, // Include columns in the returned board
      },
    });
  }

  async remove(id: string): Promise<Board | null> {
    try {
      const board = await this.prisma.board.findUnique({ where: { id } });
      if (!board) {
        throw new CustomError('Board not found', 'CustomError');
      }
      // Check if related columns exist
      const columnsExist = await this.prisma.column.count({
        where: {
          boardId: id,
        },
      });
      if (columnsExist > 0) {
        // Delete related columns first
        await this.prisma.column.deleteMany({
          where: {
            boardId: id,
          },
        });
      }
      // Then delete the board
      await this.prisma.board.delete({
        where: {
          id: id,
        },
      });
      return board;
    } catch (error) {
      throw error;
    }
  }

  // service to delete a column from a board
  async removeColumn(boardId: string, columnId: string): Promise<Board | null> {
    try {
      const board = await this.prisma.board.findUnique({
        where: { id: boardId },
      });
      if (!board) {
        throw new CustomError('Board not found', 'CustomError');
      }

      const columnsExist = await this.prisma.column.count({
        where: {
          boardId: boardId,
        },
      });

      if (columnsExist <= 1) {
        throw new CustomError('Cannot delete last column', 'CustomError');
      }
      // Check if the column exists
      const column = await this.prisma.column.findUnique({
        where: {
          id: columnId,
          boardId: boardId,
        },
      });
      if (!column) {
        throw new CustomError('Column not found', 'CustomError');
      }

      // Delete related tasks first
      await this.prisma.task.deleteMany({
        where: {
          columnId: columnId,
          boardId: boardId,
        },
      });

      // Delete the column
      await this.prisma.column.delete({
        where: {
          id: columnId,
        },
      });
      return column;
    } catch (error) {
      throw error;
    }
  }
}

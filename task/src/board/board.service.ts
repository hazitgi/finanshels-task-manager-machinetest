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
    return this.prisma.board.findUnique({ where: { id } });
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

  async remove(id: string): Promise<Board> {
    return this.prisma.board.delete({ where: { id } });
  }
}

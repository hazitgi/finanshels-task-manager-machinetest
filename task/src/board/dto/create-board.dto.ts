// src/board/dto/create-board.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateColumnDto {
  @IsString({ message: 'Column name must be a string' })
  @IsNotEmpty({ message: 'Column name is required' })
  name: string;

  // @IsString({ message: 'Column slug must be a string' })
  // @IsNotEmpty({ message: 'Column slug is required' })
  // slug: string;

  @IsString({ message: 'Column color must be a string' })
  @IsNotEmpty({ message: 'Column color is required' })
  color: string;
}

export class CreateBoardDto {
  @IsString({ message: 'Board name must be a string' })
  @IsNotEmpty({ message: 'Board name is required' })
  name: string;

  // @IsString({ message: 'Board boardId must be a string' })
  // @IsNotEmpty({ message: 'Board boardId is required' })
  // boardId: string;

  @IsArray({ message: 'Columns must be an array' })
  @ValidateNested({ each: true, message: 'Each column must be a valid object' })
  @ArrayMinSize(1, { message: 'At least one column is required' })
  @Type(() => CreateColumnDto)
  columns: CreateColumnDto[];
}

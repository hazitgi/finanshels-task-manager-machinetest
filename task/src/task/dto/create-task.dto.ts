import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SubtaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsBoolean()
  isCompleted: boolean;
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Slug is required' })
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Order Number is required' })
  order: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubtaskDto)
  subtasks: SubtaskDto[];

  @IsString()
  @IsNotEmpty({ message: 'Column ID is required' })
  column: string;

  @IsString()
  @IsNotEmpty({ message: 'Board ID is required' })
  board: string;
}

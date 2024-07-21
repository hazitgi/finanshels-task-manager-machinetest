import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNumber,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class SubtaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsBoolean()
  isCompleted: boolean;
}
export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'Title must be a non-empty string if provided' })
  title?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'Slug must be a non-empty string if provided' })
  slug?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'Description must be a non-empty string if provided' })
  description?: string;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty({ message: 'Order must be a number if provided' })
  order?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SubtaskDto)
  subtasks?: SubtaskDto[];

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'Column ID must be a non-empty string if provided' })
  columnId?: string;

  //   @IsString()
  //   @IsOptional()
  //   @IsNotEmpty({ message: 'Board ID must be a non-empty string if provided' })
  //   boardId?: string;
}

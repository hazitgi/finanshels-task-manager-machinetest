import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateColumnDto {
  @IsOptional()
  @IsString({ message: 'Column name must be a string' })
  @IsNotEmpty({ message: 'Column name is required' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Column slug must be a string' })
  @IsNotEmpty({ message: 'Column slug is required' })
  slug?: string;

  @IsOptional()
  @IsString({ message: 'Column color must be a string' })
  @IsNotEmpty({ message: 'Column color is required' })
  color?: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty({ message: 'Board name is required' })
  id?: number;
}

export class UpdateBoardDto {
  @IsOptional()
  @IsString({ message: 'Board name must be a string' })
  @IsNotEmpty({ message: 'Board name is required' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Board slug must be a string' })
  @IsNotEmpty({ message: 'Board slug is required' })
  slug?: string;

  @IsOptional()
  @IsArray({ message: 'Columns must be an array' })
  @ValidateNested({ each: true, message: 'Each column must be a valid object' })
  @ArrayMinSize(1, { message: 'At least one column is required' })
  @Type(() => UpdateColumnDto)
  columns?: UpdateColumnDto[];
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from 'class-validator';

export class IngredientDto {
  @ApiProperty({ example: 'Pasta' })
  @IsString()
  name: string;

  @ApiProperty({ example: '200g' })
  @IsString()
  amount: string;
}

export class CreateRecipeDto {
  @ApiProperty({ example: 'Pasta Primavera' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'A light, colourful spring pasta.' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-xyz' })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({ example: 25 })
  @IsInt()
  @Min(1)
  prepMinutes: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  servings: number;

  @ApiProperty({ example: ['vegetarian', 'quick'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ type: [IngredientDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients: IngredientDto[];

  @ApiProperty({ example: ['Boil pasta', 'Sauté vegetables'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  steps: string[];
}

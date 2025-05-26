import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateProductDto {

    @ApiProperty({
        description: 'Product name',
        example: 'Santexnik',
    })
    name: string;
  @ApiProperty({
    description: 'URL or path to the product image',
    example: 'https://example.com/images/product.jpg',
  })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({
    description: 'Minimum working hours required',
    example: 2,
  })
  @IsNumber()
  @IsPositive()
  minWorkingHours: number;

  @ApiProperty({
    description: 'Hourly rental price',
    example: 15.5,
  })
  @IsNumber()
  @IsPositive()
  priceHourly: number;

  @ApiProperty({
    description: 'Daily rental price',
    example: 120,
  })
  @IsNumber()
  @IsPositive()
  priceDaily: number;

  @ApiProperty({
    description: 'List of required tools',
    example: [1,2],
    type: [Number],
  })
  @IsArray()
  tools: number[];

  @ApiProperty({
    description: 'Product description',
    example: 'Reliable drill for professional use.',
  })
  @IsString()
  @MinLength(10)
  description: string;
}

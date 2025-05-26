// src/product/dto/query-product.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryProductDto {
  @ApiPropertyOptional({ description: 'Filter products by name (partial match)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 1, description: 'Page number for pagination' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 10;
}

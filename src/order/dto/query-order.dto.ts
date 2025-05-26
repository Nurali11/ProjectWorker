// src/order/dto/query-order.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsString, IsInt, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryOrderDto {
  @ApiPropertyOptional({ description: 'Filter by address keyword' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Filter by payment type (e.g., Cash, Credit Card)' })
  @IsOptional()
  @IsString()
  paymentType?: string;

  @ApiPropertyOptional({ description: 'Filter by delivery flag (true or false)' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  withDelivery?: boolean;

  @ApiPropertyOptional({ description: 'Filter by scheduled date (ISO format)' })
  @IsOptional()
  @IsDateString()
  date?: Date;

  @ApiPropertyOptional({ example: 1, description: 'Page number' })
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
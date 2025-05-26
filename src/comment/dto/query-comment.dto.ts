// src/comment/dto/query-comment.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryCommentDto {
  @ApiPropertyOptional({ description: 'Filter comments by orderId' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  orderId?: number;

  @ApiPropertyOptional({ description: 'Filter by content of message (partial match)' })
  @IsOptional()
  @IsString()
  message?: string;

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

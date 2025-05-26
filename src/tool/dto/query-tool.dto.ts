// src/tool/dto/query-tool.dto.ts
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsInt, IsString } from "class-validator";

export class QueryToolDto {
  @ApiPropertyOptional({ description: "Search by name" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: "Filter by brandId" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  brandId?: number;

  @ApiPropertyOptional({ description: "Filter by sizeId" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sizeId?: number;

  @ApiPropertyOptional({ description: "Filter by capacityId" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  capacityId?: number;

  @ApiPropertyOptional({ description: "Page number", example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional({ description: "Items per page", example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 10;
}

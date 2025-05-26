// src/master/dto/query-master.dto.ts
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsBoolean, IsInt } from "class-validator";
import { Type } from "class-transformer";

export class QueryMasterDto {
  @ApiPropertyOptional({ description: "Search by name" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: "Filter by levelId" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  levelId?: number;

  @ApiPropertyOptional({ description: "Filter by isActive status" })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

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

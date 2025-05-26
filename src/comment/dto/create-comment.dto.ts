import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MasterRatingDto {
  @ApiProperty({
    example: 4,
  })
  @IsNumber()
  star: number;

  @ApiProperty({
    example: 'masterId',
  })
  @IsNumber()
  masterId: number;
}

export class CreateCommentDto {
  @ApiProperty({
    example: 'Very good',
  })
  @IsString()
  message: string;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  orderId: number;

  @ApiProperty({
    example: [
      {
        star: 4,
        masterId: 1,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MasterRatingDto)
  masterStar: MasterRatingDto[];
}
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsString,
  ArrayNotEmpty,
  IsNotEmpty,
  IsJSON,
  IsObject,
} from 'class-validator';

export class OrderDto {
  @ApiProperty({
    example: {
      lat: "40.7128",
      long: "-74.0060"
    }
  })
  @IsObject()
  location: {
    lat: string;
    long: string;
  };

  @ApiProperty({
    example: '221B Baker Street, London',
    description: 'Exact address for the order',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: 'Cash',
    description: 'Payment method for the order',
  })
  paymentType: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the order includes delivery',
  })
  withDelivery: boolean;
 
  @ApiProperty({
    example: 'Please deliver the tools to the specified address',
    description: 'Additional comments for delivery',
  })
  commentToDelivery: string;

  @ApiProperty({
    example: '2025-06-01T10:00:00Z',
    description: 'Date and time when the service is scheduled',
  })
  @IsDateString()
  date: Date;

  @ApiProperty({
    example: {
      productId: 1,
      levelId: 2,
      quantity: 5,
      measure: "8 hours"
    },
  })
  OrderProducts: {
    productId: number;
    levelId: number;
    quantity: number;
      measure: string;
  }
  
    @ApiProperty({
    example: [
      { toolId: 1, quantity: 2 },
      { toolId: 2, quantity: 3 }
    ],
    description: 'IDs and quantity of the tool assigned to the order',
  })
  @ArrayNotEmpty()
  @IsArray()
  @IsNotEmpty()
  OrderTools: { toolId: number, quantity: number }[];
}

export class OrderWorkerConnectDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the master assigned to the order',
  })
  orderId: number;

  @ApiProperty({
    example: [1, 2],
    description: 'IDs of the masters assigned to the order',
  })
  mastersId: number[];
}

export class OrderToolDto {
  @ApiProperty({
    example: 'New York',
    description: 'City or general location where the order is to be fulfilled',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    example: '221B Baker Street, London',
    description: 'Exact address for the order',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: '2025-06-01T10:00:00Z',
    description: 'Date and time when the service is scheduled',
  })
  @IsDateString()
  date: Date;


  @ApiProperty({
    example: [
      { toolId: 1, quantity: 2 },
      { toolId: 2, quantity: 3 }
    ],
    description: 'IDs and quantity of the tool assigned to the order',
  })
  @ArrayNotEmpty()
  @IsArray()
  @IsNotEmpty()
  toolsId: { toolId: number, quantity: number }[];
}
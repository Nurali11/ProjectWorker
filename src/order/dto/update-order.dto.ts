import { PartialType } from '@nestjs/swagger';
import { OrderDto } from './create-order.dto';
import { Order } from '../entities/order.entity';

export class UpdateOrderDto extends PartialType(OrderDto) {}

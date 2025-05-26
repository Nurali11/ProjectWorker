import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto, OrderToolDto, OrderWorkerConnectDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { QueryOrderDto } from './dto/query-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Post()
  orserWorker(@Body() data: OrderDto, @Req() req: Request) {
    return this.orderService.order(data, req);
  }

  @Post("ConnectWorker")
  orderWorkerConnect(@Body() data: OrderWorkerConnectDto) {
    return this.orderService.ConnectWorker(data);
  }

  @Get("my-orders")
  myOrders(@Req() req: Request){
    return this.orderService
  }

@Get()
findAll(@Query() query: QueryOrderDto) {
  return this.orderService.findAll(query);
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}

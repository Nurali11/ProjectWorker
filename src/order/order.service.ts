import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderToolDto, OrderDto, OrderWorkerConnectDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { MailService } from 'src/mail/mail.service';
import { BADFAMILY } from 'dns';
import { ApiQuery } from '@nestjs/swagger';
import { QueryOrderDto } from './dto/query-order.dto';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private mailer: MailService
  ){}
  async order(data: OrderDto, req: Request) {
  try {
    let { date, OrderTools, location, OrderProducts, ...rest } = data;

    let TOOL_TotalPrice = 0;

    for (const { toolId, quantity } of OrderTools) {
      const toolExists = await this.prisma.tool.findFirst({
        where: { id: toolId },
      });
      
      if (!toolExists) {
        throw new BadRequestException(`Tool with ID ${toolId} does not exist`);
      }

      if(quantity > toolExists.quantity){
        throw new BadRequestException(`Bu tool dan ${quantity}-ta yoq! Faqat ${toolExists.quantity}-ta qoldi!`)
      }

      await this.prisma.tool.update({where: {id: toolExists.id}, data: {quantity: toolExists.quantity - quantity}})
      
      TOOL_TotalPrice += toolExists.price * quantity;
    }

    const {productId, levelId, quantity} = data.OrderProducts;
    const productExists = await this.prisma.product.findFirst({
      where: { id: productId },
    });
    if (!productExists) {
      throw new BadRequestException(`Product with ID ${productId} does not exist`);
    }
    const levelExists = await this.prisma.level.findFirst({
      where: { id: levelId },
    });

    if (!levelExists) {
      throw new BadRequestException(`Level with ID ${levelId} does not exist`);
    }

    const newOrder = await this.prisma.order.create({
      data: {
        ...rest,
        totalPrice: TOOL_TotalPrice,
        date,
        Products: {
          connect: {
            id: productId,
          },
        },
        Tools: {
          connect: OrderTools.map((tool) => ({
            id: tool.toolId,
          })),
        },
        userId: req["user"].id,
        location: location,
      },
      include: {
        Tools: true,
        Products: true,
        User: true, 
        Masters: true,
      },
    });

    return {
      message: "Order muvaffaqiyatli yaratildi, endi sizga most workerlarni izlayapmiz",
      TOOL_TotalPrice,
      newOrder};
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}

  async ConnectWorker(data: OrderWorkerConnectDto) {
    try {
      let { mastersId, orderId } = data;
      let totalCost = 0;

      const existingOrder = await this.prisma.order.findFirst({
        where: { id: orderId },
      });

      const user = await this.prisma.user.findFirst({where: {id: existingOrder?.userId || 1}})

      if (!existingOrder) {
        throw new BadRequestException(`Order with ID ${orderId} does not exist`);
      }

      const orderDate = new Date(existingOrder.date);
      const currentTime = new Date();

      for (const masterId of mastersId) {
      const master = await this.prisma.master.findFirst({
        where: { id: masterId },
      });

      if (!master) {
        throw new BadRequestException(`Master with ID ${masterId} does not exist`);
      }

      const durationMs = orderDate.getTime() - currentTime.getTime();
      if (durationMs <= 0) {
        throw new BadRequestException(`Order time must be in the future`);
      }

      const totalHours = Math.floor(durationMs / (1000 * 60 * 60));
      const fullDays = Math.floor(totalHours / 24);
      const remainingHours = totalHours % 24;

      totalCost += fullDays * master.priceDaily + remainingHours * master.priceHourly;

      const endDate = new Date(orderDate);

      if (currentTime >= endDate) {
        await this.prisma.master.update({
          where: { id: masterId },
          data: { isActive: false },
        });
      }
    }

    
    const updatedMasters = await this.prisma.master.updateMany({
      where: { id: { in: mastersId } },
      data: { isActive: false },
    });
    
    const newOrder = await this.prisma.order.update({
      where: { id: orderId }, 
      data: {
        Masters: {
          connect: mastersId.map((id) => ({ id })),
        },
        totalPrice: totalCost,
        date: orderDate,
      },
      include: {
        Tools: true,
        Products: true,
        User: true,
        Masters: true,
      }
    });
    
    this.mailer.workerFound(user?.email || "user@gmail.com", "Worker found! 👷‍♀️", `${JSON.stringify(await this.prisma.master.findFirst({where: {id: {in: mastersId}}}))}`)
    return {
        totalCost,
        newOrder,
        updatedMasters
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async myOrders(req: Request){
    try {
      let my = await this.prisma.order.findMany({where: { userId: req['user'].id}, include: { Tools: true, Masters: true}})
      return {
        count: my.length,
        my
      }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
  // order.service.ts
async findAll(query: QueryOrderDto) {
  const {
    address,
    paymentType,
    withDelivery,
    date,
    page = 1,
    limit = 10
  } = query;

  const where: any = {};

  if (address) {
    where.address = { contains: address, mode: 'insensitive' };
  }

  if (paymentType) {
    where.paymentType = paymentType;
  }

  if (withDelivery !== undefined) {
    where.withDelivery = withDelivery;
  }

  if (date) {
    where.date = date;
  }

  const [orders, total] = await this.prisma.$transaction([
    this.prisma.order.findMany({
      where,
      include: {
        Tools: true,
        Masters: true,
      },
      skip: (+page - 1) * +limit,
      take: +limit,
    }),
    this.prisma.order.count({ where }),
  ]);

  return {
    data: orders,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}


  async findOne(id: number) {
    try {
      let one = await this.prisma.order.findFirst({
        where: { id },
        include: {
          Tools: true,
          Masters: true,
        },
      });
      if (!one) {
        throw new BadRequestException('Order not found');
      }
      return one;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      let updated = await this.prisma.order.update({
        where: { id },
        data: updateOrderDto,
      });
      return updated;

    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      let deleted = await this.prisma.order.delete({
        where: { id },
      });
      return deleted;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

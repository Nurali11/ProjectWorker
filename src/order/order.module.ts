import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MailService } from 'src/mail/mail.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, MailService],
})
export class OrderModule {}

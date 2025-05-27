import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { TgMessage } from './message';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import { OrderService } from 'src/order/order.service';
import { AdminMessage } from './adminMessage';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: "7712520438:AAEMRHYiDeRhGlX7AqT9Dsjypc85lAcwvGE",
      middlewares: [session()],
    })
  ],
  providers: [TgMessage, UserService, MailService, OrderService]
})
export class BotModule { }
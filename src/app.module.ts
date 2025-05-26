import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MasterModule } from './master/master.module';
import { LevelModule } from './level/level.module';
import { ToolModule } from './tool/tool.module';
import { OrderModule } from './order/order.module';
import { SizeModule } from './size/size.module';
import { BrandModule } from './brand/brand.module';
import { CapacityModule } from './capacity/capacity.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ProductModule } from './product/product.module';
import { RegionModule } from './region/region.module';
import { CommentModule } from './comment/comment.module';
import { SessionsModule } from './sessions/sessions.module';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [UserModule, SessionsModule, MasterModule, ToolModule, OrderModule, SizeModule, BrandModule, LevelModule, CapacityModule, PrismaModule,
    JwtModule.register({
      global: true,
      secret: "sekret",
      signOptions: { expiresIn: '60s' },
    }),
    ProductModule,
    RegionModule,
    CommentModule,
    BotModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

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
import { MulterController } from './multer/multer.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GeneralinfoModule } from './generalinfo/generalinfo.module';
import { FaqModule } from './faq/faq.module';
import { ContactModule } from './contact/contact.module';
import { PartnerModule } from './partner/partner.module';
import { ShowcaseModule } from './showcase/showcase.module';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    GeneralinfoModule,
    FaqModule,
    ContactModule,
    PartnerModule,
    ShowcaseModule

  ],
  controllers: [AppController, MulterController],
  providers: [AppService],
})
export class AppModule {}

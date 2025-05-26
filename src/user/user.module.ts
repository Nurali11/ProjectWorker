import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UserController],
  providers: [UserService, MailService, JwtService],
})
export class UserModule {}

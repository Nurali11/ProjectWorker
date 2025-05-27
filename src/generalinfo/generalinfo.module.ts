import { Module } from '@nestjs/common';
import { GeneralinfoService } from './generalinfo.service';
import { GeneralinfoController } from './generalinfo.controller';

@Module({
  controllers: [GeneralinfoController],
  providers: [GeneralinfoService],
})
export class GeneralinfoModule {}

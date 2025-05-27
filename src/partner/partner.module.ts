import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';

@Module({
  controllers: [PartnerController],
  providers: [PartnerService],
})
export class PartnerModule {}

import { Module } from '@nestjs/common';
import { CapacityService } from './capacity.service';
import { CapacityController } from './capacity.controller';

@Module({
  controllers: [CapacityController],
  providers: [CapacityService],
})
export class CapacityModule {}

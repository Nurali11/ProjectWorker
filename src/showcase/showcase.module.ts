import { Module } from '@nestjs/common';
import { ShowcaseService } from './showcase.service';
import { ShowcaseController } from './showcase.controller';

@Module({
  controllers: [ShowcaseController],
  providers: [ShowcaseService],
})
export class ShowcaseModule {}

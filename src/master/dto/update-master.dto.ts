import { PartialType } from '@nestjs/swagger';
import { CreateMasterDto } from './create-master.dto';

export class UpdateMasterDto extends PartialType(CreateMasterDto) {}

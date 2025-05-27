import { PartialType } from '@nestjs/swagger';
import { CreateGeneralinfoDto } from './create-generalinfo.dto';

export class UpdateGeneralinfoDto extends PartialType(CreateGeneralinfoDto) {}

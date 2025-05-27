import { Injectable } from '@nestjs/common';
import { CreateGeneralinfoDto } from './dto/create-generalinfo.dto';
import { UpdateGeneralinfoDto } from './dto/update-generalinfo.dto';

@Injectable()
export class GeneralinfoService {
  create(createGeneralinfoDto: CreateGeneralinfoDto) {
    return 'This action adds a new generalinfo';
  }

  findAll() {
    return []
  }

  findOne(id: number) {
    return `Hali hechnarsa topilmadi. #${id} generalinfo`;
  }

  update(id: number, updateGeneralinfoDto: UpdateGeneralinfoDto) {
    return `This action updates a #${id} generalinfo`;
  }

  remove(id: number) {
    return `This action removes a #${id} generalinfo`;
  }
}

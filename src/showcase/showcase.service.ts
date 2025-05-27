import { Injectable } from '@nestjs/common';
import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';

@Injectable()
export class ShowcaseService {
  create(createShowcaseDto: CreateShowcaseDto) {
    return 'This action adds a new showcase';
  }

  findAll() {
    return [];
  }

  findOne(id: number) {
    return `Hali hechnarsa topilmadi. #${id} showcase`;
  }

  update(id: number, updateShowcaseDto: UpdateShowcaseDto) {
    return `This action updates a #${id} showcase`;
  }

  remove(id: number) {
    return `This action removes a #${id} showcase`;
  }
}

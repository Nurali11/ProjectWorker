import { Injectable } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqService {
  create(createFaqDto: CreateFaqDto) {
    return 'This action adds a new faq';
  }

  findAll() {
    return []
  }

  findOne(id: number) {
    return `Hali hechnarsa topilmadi. #${id} faq`;
  }

  update(id: number, updateFaqDto: UpdateFaqDto) {
    return `This action updates a #${id} faq`;
  }

  remove(id: number) {
    return `This action removes a #${id} faq`;
  }
}

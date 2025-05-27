import { Injectable } from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnerService {
  create(createPartnerDto: CreatePartnerDto) {
    return 'This action adds a new partner';
  }

  findAll() {
    return []
  }

  findOne(id: number) {
    return `Hali hechnarsa topilmadi. #${id} partner`;
  }

  update(id: number, updatePartnerDto: UpdatePartnerDto) {
    return `This action updates a #${id} partner`;
  }

  remove(id: number) {
    return `This action removes a #${id} partner`;
  }
}

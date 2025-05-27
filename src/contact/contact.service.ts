import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactService {
  create(createContactDto: CreateContactDto) {
    return 'This action adds a new contact';
  }

  findAll() {
    return []
  }

  findOne(id: number) {
    return `Hali hechnarsa topilmadi. #${id} contact`;
  }

  update(id: number, updateContactDto: UpdateContactDto) {
    return `This action updates a #${id} contact`;
  }

  remove(id: number) {
    return `This action removes a #${id} contact`;
  }
}

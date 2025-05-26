import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCapacityDto } from './dto/create-capacity.dto';
import { UpdateCapacityDto } from './dto/update-capacity.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CapacityService {
  constructor(
    private prisma: PrismaService
  ){}
  async create(data: CreateCapacityDto) {
    try {
      let newCapacity = await this.prisma.capacity.create({data})
      return newCapacity
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(name: string) {
    try {
      let all = await this.prisma.capacity.findMany({where: {
          name: name ? {contains: name, mode: "insensitive"} : {} 
      }})
      return all
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      let one = await this.prisma.capacity.findFirst({where: {id}})
      if (!one) {
        throw new BadRequestException("Capacity not found")
      }
      return one
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateCapacityDto: UpdateCapacityDto) {
    try {
      let updated = await this.prisma.capacity.update({
        where: {id},
        data: updateCapacityDto
      })
      return updated
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      let deleted = await this.prisma.capacity.delete({where: {id}})
      return deleted
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

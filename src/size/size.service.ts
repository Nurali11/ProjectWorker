import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { contains } from 'class-validator';
import e from 'express';

@Injectable()
export class SizeService {
  constructor(
    private prisma: PrismaService
  ){}
  async create(createSizeDto: CreateSizeDto) {
    try {
      let newSize = await this.prisma.size.create({data: createSizeDto})
      return newSize
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(name: string) {
    try {
      let allSizes = await this.prisma.size.findMany({
        where: {
          name: name ? {contains: name, mode: "insensitive"} : {}
        }
      })
      return allSizes
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      let one = await this.prisma.size.findFirst({where: {id}})
      if (!one) {
        throw new BadRequestException("Size not found")
      }
      return one
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateSizeDto: UpdateSizeDto) {
    try {
      let updated = await this.prisma.size.update({
        where: {id},
        data: updateSizeDto
      })
      return updated
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      let deleted = await this.prisma.size.delete({where: {id}})
      return deleted
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

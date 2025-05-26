import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { contains } from 'class-validator';

@Injectable()
export class BrandService {
  constructor(
    private prisma: PrismaService
  ){}
  async create(data: CreateBrandDto) {
    try {
      let newBrand = await this.prisma.brand.create({data})
      return newBrand
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(name: string) {
    try {
      let allBrands = await this.prisma.brand.findMany({
        where: {
          name: name ? {contains: name, mode: "insensitive"} : {} 
        }
      })
      return allBrands
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      let one = await this.prisma.brand.findFirst({where: {id}})
      if (!one) {
        throw new BadRequestException("Brand not found")
      }
      return one
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    try {
      let updated = await this.prisma.brand.update({
        where: {id},
        data: updateBrandDto
      })
      return updated
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      let deleted = await this.prisma.brand.delete({where: {id}})
      return deleted
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

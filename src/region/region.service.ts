import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { concatAll } from 'rxjs';

@Injectable()
export class RegionService {
  constructor(
    private prisma: PrismaService
  ){}
  async create(data: CreateRegionDto) {
    try {
      let newRegion = await this.prisma.region.create({
        data
      })
      return newRegion
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(name: string) {
    try {
      let all = await this.prisma.region.findMany({
        where: {
          name: name ? {contains: name, mode: "insensitive"} : {}
        }
      })
      return all
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      let one = await this.prisma.region.findUnique({where: {id}})
      return one
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateRegionDto: UpdateRegionDto) {
    try {
      let updated = await this.prisma.region.update({
        where: {id},
        data: updateRegionDto
      })
      return updated
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      let deleted = await this.prisma.region.delete({
        where: {id}
      })
      return deleted
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { contains } from 'class-validator';

@Injectable()
export class LevelService {
  constructor(
    private prisma: PrismaService
  ){}
  async create(data: CreateLevelDto) {
    try {
      let newLevel = await this.prisma.level.create({data})
      return newLevel
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(name: string) {
    try {
      let all = await this.prisma.level.findMany({
        where: {
          name: name ? { contains: name, mode: "insensitive"} : {}
        }
      })
      return all
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      let one = await this.prisma.level.findFirst({where: {id}})
      if (!one) {
        throw new BadRequestException("Level not found")
      }
      return one
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateLevelDto: UpdateLevelDto) {
    try {
      let updated = await this.prisma.level.update({
        where: {id},
        data: updateLevelDto
      })
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      let deleted = await this.prisma.level.delete({where: {id}})
      return deleted
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

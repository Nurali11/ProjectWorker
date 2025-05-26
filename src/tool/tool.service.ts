import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryToolDto } from './dto/query-tool.dto';

@Injectable()
export class ToolService {
  constructor(
    private prisma: PrismaService
  ){}
  async create(data: CreateToolDto) {
    try {
      let code = Math.floor(Math.random() * 1000000)
      let newTool = await this.prisma.tool.create({
        data: {
          ...data,
          code: code
        }
      })
      return newTool
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

async findAll(query: QueryToolDto) {
  const { name, brandId, sizeId, capacityId, page = 1, limit = 10 } = query;

  const where: any = {};

  if (name) {
    where.name = {
      contains: name,
      mode: 'insensitive', // case-insensitive search
    };
  }

  if (brandId) where.brandId = brandId;
  if (sizeId) where.sizeId = sizeId;
  if (capacityId) where.capacityId = capacityId;

  const tools = await this.prisma.tool.findMany({
    where,
    include: {
      Brand: true,
      Size: true,
      Capacity: true,
    },
    skip: (+page - 1) * +limit,
    take: +limit,
  });

  const total = await this.prisma.tool.count({ where });

  return {
    data: tools,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}


  async findOne(id: number) {
    try {
      let one = await this.prisma.tool.findFirst({
        where: {id},
        include: {
          Brand: true,
          Size: true,
          Capacity: true
        }
      })

      if (!one) {
        throw new BadRequestException("Tool not found")
      }

      return one
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateToolDto: UpdateToolDto) {
    try {
      let updated = await this.prisma.tool.update({
        where: {id},
        data: updateToolDto
      })

      if (!updated) {
        throw new BadRequestException("Tool not found")
      }

      return updated
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      let deleted = await this.prisma.tool.delete({where: {id}})

      if (!deleted) {
        throw new BadRequestException("Tool not found")
      }

      return deleted
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMasterDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryMasterDto } from './dto/query-master.dto';

@Injectable()
export class MasterService {
  constructor(
    private prisma: PrismaService
  ){}
  async create(data: CreateMasterDto) {
  try {
    const { levelId, productsId = [], ...restData } = data;

    const levelExists = await this.prisma.level.findFirst({
      where: { id: levelId },
    });
    if (!levelExists) {
      throw new BadRequestException(`Level with ID ${levelId} does not exist`);
    }

    const newMaster = await this.prisma.master.create({
      data: {
        ...restData,
        Level: {
          connect: { id: levelId }
        },
        products: {
          connect: productsId.map((id) => ({ id }))  
        }
      },
    });

    return newMaster;
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}

async findAll(query: QueryMasterDto) {
  const {
    name,
    levelId,
    isActive,
    page = 1,
    limit = 10
  } = query;

  const where: any = {};

  if (name) {
    where.name = {
      contains: name,
      mode: "insensitive"
    };
  }

  if (levelId !== undefined) {
    where.levelId = levelId;
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  const all = await this.prisma.master.findMany({
    where,
    include: {
      products: {
        select: {
          name: true,
          isActive: true,
          description: true,
        },
      },
      Level: true,
      Stars: {
        include: {
          Comment: true,
        },
      },
    },
    skip: (+page - 1) * +limit,
    take: +limit,
  });

  const total = await this.prisma.master.count({ where });

  const mastersWithAvg = all.map(master => {
    const totalStars = master.Stars.reduce((sum, star) => sum + star.star, 0);
    const count = master.Stars.length;
    const average_Star = count > 0 ? (totalStars / count).toFixed(1) : '0.0';

    return {
      ...master,
      average_Star,
    };
  });

  return {
    data: mastersWithAvg,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}



  async findOne(id: number) {
    try {
      let one = await this.prisma.master.findFirst({where: {id}})
      if (!one) {
        throw new BadRequestException("Master not found")
      }
      return one
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateMasterDto: UpdateMasterDto) {
    try {
      let updated = await this.prisma.master.update({
        where: {id},
        data: updateMasterDto
      })

      return updated
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      let deleted = await this.prisma.master.delete({where: {id}})
      return deleted
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

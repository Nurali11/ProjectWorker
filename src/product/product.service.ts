import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService
  ){}
  async create(data: CreateProductDto) {
    try {
      let newProduct = await this.prisma.product.create({
        data: {
          ...data,
          tools: {
            connect: data.tools.map((id) => ({ id }))
          }
        }
      })
      return newProduct
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

// product.service.ts
async findAll(query: QueryProductDto) {
  const { name, page = 1, limit = 10 } = query;
  
  const where: any = {};
  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }

  const [products, total] = await this.prisma.$transaction([
    this.prisma.product.findMany({
      where,
      include: { tools: true },
      skip: (page - 1) * limit,
      take: limit,
    }),
    this.prisma.product.count({ where }),
  ]);

  return {
    data: products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}


  async findOne(id: number) {
    try {
      let one = await this.prisma.product.findFirst({where: {id}, include: {tools: true}})
      return one
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      let updated = await this.prisma.product.update({
        where: {id},
        data: {
          ...updateProductDto,
          tools: {
            set: [],
            connect: updateProductDto?.tools?.map((id) => ({ id }))
          }
        }
      })
      return updated
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      let deleted = await this.prisma.product.delete({
        where: {id}
      })
      return deleted
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

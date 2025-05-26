import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // путь подкорректируй под свой проект
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Request } from 'express';
import { QueryCommentDto } from './dto/query-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCommentDto, req: Request) {
    try {
      for(const master of data.masterStar){
        const existingMaster = await this.prisma.master.findFirst({where: {id: master.masterId}})
        if(!existingMaster){
            throw new BadRequestException(`Master with ID ${master.masterId} does not exist`)
        }
    }

    let newComment = await this.prisma.comment.create({ data: {
        message: data.message,
        orderId: data.orderId,
        userId: req['user'].id
    }})

      for(const master of data.masterStar){
        let newStar = await this.prisma.star.create({
            data: {
                star: master.star,
                masterId: master.masterId,
                commentId: newComment.id,
            }
        })
      }

      return await this.prisma.comment.findFirst({where: {id: newComment.id}, include: {star: true}})
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

// comment.service.ts
async findAll(query: QueryCommentDto) {
  const { orderId, message, page = 1, limit = 10 } = query;

  const where: any = {};

  if (orderId) {
    where.orderId = orderId;
  }

  if (message) {
    where.message = { contains: message, mode: 'insensitive' };
  }

  const [comments, total] = await this.prisma.$transaction([
    this.prisma.comment.findMany({
      where,
      include: {
        star: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    this.prisma.comment.count({ where }),
  ]);

  return {
    data: comments,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}


  async myComments(req: Request){
    try {
        let all = await this.prisma.comment.findMany({where: { userId: req['user'].id}, include: {star: true}})
        if(all.length == 0){
            return "Siz hali comment yozmadingiz"
        }
        return all
    } catch (error) {
        throw new BadRequestException(error.message)
    }
  }
  async findOne(id: number) {
    try {
      const comment = await this.prisma.comment.findFirst({
        where: { id },
        include: {star: true}
      });

      if (!comment) {
        throw new BadRequestException(`Comment with ID ${id} not found`);
      }

      return comment;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    try {
      return await this.prisma.comment.update({
        where: { id },
        data: updateCommentDto,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.comment.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

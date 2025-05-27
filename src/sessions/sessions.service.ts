import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
const DeviceDetector = require("device-detector-js");
const deviceDetector = new DeviceDetector()

@Injectable()
export class SessionsService {
  constructor(
    private readonly prisma: PrismaService
  ){}
  async findAll(req: Request) {
    try {
      let all = await this.prisma.sessions.findMany({ where: { userId: req['user'].id, isActive: true } })
      if (!all || all.length === 0) {
        throw new BadRequestException("No active sessions found for this user");
      }
      return all
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number, req: Request) {
    try {
      let one = await this.prisma.sessions.findFirst({
        where: {id, userId: req['user'].id}
      })
      let user = await this.prisma.user.findFirst({
        where: {id: req['user'].id}
      })

      if (!one) {
        throw new BadRequestException(`Session with ID ${id} does not exist`);
      }

      if(user?.role !== "ADMIN" && user?.id != one.userId) {
        throw new BadRequestException(`You have no permission to delete oters sessions. Only ADMIN can do that`);
      }
      
      let deleted = this.prisma.sessions.update({
        where: { id },
        data: {
          isActive: false
        }
      })
      return deleted;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

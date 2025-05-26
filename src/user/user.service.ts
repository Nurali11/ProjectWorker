import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginDto, RegisterEmail, VerifyEmail } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { totp} from 'otplib';
import { MailService } from 'src/mail/mail.service';
import { contains } from 'class-validator';
const DeviceDetector = require("device-detector-js");
totp.options = {digits: 5, step: 300}
const deviceDetector = new DeviceDetector()

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private mailer: MailService
  ){}
  
  async register(data: CreateUserDto) {
    try {
      let {password, regionId, ...rest} = data
      let hashed = bcrypt.hashSync(password, 10)

      let user = await this.prisma.user.findFirst({where: {email: data.email}})
      if(user){
        throw new BadRequestException("User already exists")
      }
      let region = await this.prisma.region.findFirst({where: {id: regionId}})
      if(!region){
        throw new BadRequestException("Region not found")
      }

      let newUser = await this.prisma.user.create({
        data: {
          ...rest,
          Region: {
            connect: {
              id: regionId
            }
          },
          password: hashed
        }
      })

      this.resendOtp({email: newUser.email? newUser.email : ""})
      return newUser
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyEmail(data: VerifyEmail) {
    try {
      let user = await this.prisma.user.findFirst({where: {email: data.email}})
      if(!user){
        throw new BadRequestException("User not found")
      }

      let match = totp.verify({token: data.otp, secret: data.email + "sekret_otp"})

        if(!match){
          throw new BadRequestException("Otp is wrong")
        }

      await this.prisma.user.update({where: {email: data.email}, data: {status: "VERIFIED"}})

        return {message: "Successfullt verified! Now you can login!"}
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async resendOtp(data: RegisterEmail){
    try {
      let otp = totp.generate(data.email + "sekret_otp")
      await this.mailer.sendMail(data.email, 'Verify your email', otp)

      console.log(otp);

      return `Otp is resent to your email! ${data.email}`
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }

  async login(data: LoginDto, req: Request) {
    try {
      let user = await this.prisma.user.findFirst({where: {email: data.email}})
      if (!user) {
        throw new BadRequestException("User not found")
      }

      if(user.status !== "VERIFIED"){
        throw new BadRequestException("User not verified")
      }

      let match = bcrypt.compareSync(data.password, user.password)
      if (!match) {
        throw new BadRequestException("Invalid password")
      }

      let access = this.jwt.sign({id: user.id, role: user.role}, {secret: "access"})
      let refresh = this.jwt.sign({id: user.id, role: user.role}, {secret: "refresh"})

      let device = deviceDetector.parse(req.headers["user-agent"])


      let existing = await this.prisma.sessions.findFirst({where: {userId: user.id, device: {
        equals: device
      }}})
      if(!existing){
        let session = await this.prisma.sessions.create({data: {device, userId: user.id}})
      }

      return {access, refresh}
    } catch (error) {
      throw new BadRequestException(error.message)
    }

  }

  

  async resetPassword( new_password: string, req: Request) {
    try {
      let user = await this.prisma.user.findFirst({where: {id: req['user'].id}})
      if (!user) {
        throw new BadRequestException("User not found")
      }
      let hashed = bcrypt.hashSync(new_password, 10)

      let updated = await this.prisma.user.update({
        where: {id: user.id},
        data: {password: hashed}
      })

      return updated
    } catch (error) {
      throw new BadRequestException(error.message);
    }

  }
  async findAll(name: string, email: string, regionId: string, phone: string) {
    try {
      let all = await this.prisma.user.findMany({
        where: {
          name: name ? {contains: name, mode: "insensitive"} : {},
          email: email ? email : {},
          regionId: regionId ? +regionId : {},
          phone: phone ? phone : {}
        }
      })
      return all
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      let one = await this.prisma.user.findUnique({where: {id}})
      return one
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, data: UpdateUserDto, req: Request) {
    try {
      let user = await this.prisma.user.findFirst({where: {id}})
      if(!user){
        throw new BadRequestException(`User with Id ${id} not found`)
      }
      if(req['user'].role !== "ADMIN" && req['user'].id !== user.id){
        throw new BadRequestException(`You are not allowed to update others account`)
      }
      let updated = await this.prisma.user.update({
        where: {id},
        data
      })
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number, req: Request) {
    try {
      let user = await this.prisma.user.findFirst({where: {id}})
      if(!user){
        throw new BadRequestException(`User with Id ${id} not found`)
      }
      if(req['user'].role !== "ADMIN" && req['user'].id !== user.id){
        throw new BadRequestException(`You are not allowed to delete others account`)
      }
      let deleted = await this.prisma.user.delete({where: {id}})
      return deleted
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

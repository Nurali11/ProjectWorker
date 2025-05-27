import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginDto, RegisterEmail, ResendOtp, ResetDto, VerifyEmail } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { ApiQuery } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Post("verify-otp")
  verifyOtp(@Body() body: VerifyEmail) {
    return this.userService.verifyEmail(body);
  }

  @Post("register")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post("login")
  login(@Body() loginUserDto: LoginDto, @Req() req: Request) {
    return this.userService.login(loginUserDto, req);
  }


  @Post("resend-otp")
  resendOtp(@Body() data: ResendOtp) {
    return this.userService.resendOtp(data)
  }

  @UseGuards(AuthGuard)
  @Post("reset-password")
  resetPassword(@Body() body: ResetDto, @Req() req: Request) {
    return this.userService.resetPassword(body.new_password, req);
  }

  @ApiQuery({
    name: "name",
    description: "Filter by name",
    required: false
  })
  @ApiQuery({
    name: "email",
    description: "Filter by email",
    required: false
  })
  @ApiQuery({
    name: "regionId",
    description: "Filter by regionId",
    required: false
  })
  @ApiQuery({
    name: "phone",
    description: "Filter by phone",
    required: false
  })
  @Get()
  findAll(@Query("name") name: string, @Query("email") email: string, @Query("regionId") regionId: string, @Query("phone") phone: string) {
    return this.userService.findAll(name, email, regionId, phone);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    return this.userService.update(+id, updateUserDto, req);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.userService.remove(+id, req);
  }
}

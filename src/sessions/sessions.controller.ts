import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}
  @UseGuards(AuthGuard)
  @Get("me")
  findAll(@Req() req: Request) {
    return this.sessionsService.findAll(req);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.sessionsService.remove(+id, req);
  }
}

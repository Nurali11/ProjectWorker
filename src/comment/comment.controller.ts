import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { QueryCommentDto } from './dto/query-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
    return this.commentService.create(createCommentDto, req);
  }


@Get()
findAll(@Query() query: QueryCommentDto) {
  return this.commentService.findAll(query);
}

  @UseGuards(AuthGuard)
  @Get("my-comments")
  MyComment(@Req() req: Request) {
    return this.commentService.myComments(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}

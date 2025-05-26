import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ToolService } from './tool.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { RoleD } from 'src/roles/decorators/role.decorator';
import { Role } from 'src/roles/roles.enum';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { ApiQuery } from '@nestjs/swagger';
import { QueryToolDto } from './dto/query-tool.dto';

@Controller('tool')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  @RoleD(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createToolDto: CreateToolDto) {
    return this.toolService.create(createToolDto);
  }

@Get()
findAll(@Query() query: QueryToolDto) {
  return this.toolService.findAll(query);
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toolService.findOne(+id);
  }

  @RoleD(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateToolDto: UpdateToolDto) {
    return this.toolService.update(+id, updateToolDto);
  }

  
  @RoleD(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toolService.remove(+id);
  }
}

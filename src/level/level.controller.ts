import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { LevelService } from './level.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Role } from 'src/roles/roles.enum';
import { RoleD } from 'src/roles/decorators/role.decorator';
import { ApiQuery } from '@nestjs/swagger';

@Controller('level')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @RoleD(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createLevelDto: CreateLevelDto) {
    return this.levelService.create(createLevelDto);
  }

  @ApiQuery({
    name: "name",
    description: "Filter levels by name",
    required: false
  })
  @Get()
  findAll(@Query("name") name: string) {
    return this.levelService.findAll(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.levelService.findOne(+id);
  }

  
  @RoleD(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLevelDto: UpdateLevelDto) {
    return this.levelService.update(+id, updateLevelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.levelService.remove(+id);
  }
}

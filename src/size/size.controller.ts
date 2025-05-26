import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SizeService } from './size.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { RoleD } from 'src/roles/decorators/role.decorator';
import { Role } from 'src/roles/roles.enum';

@Controller('size')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @RoleD(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createSizeDto: CreateSizeDto) {
    return this.sizeService.create(createSizeDto);
  }

  @ApiQuery({
    name: "name",
    description: "Filter size by name",
    required: false
  })
  @Get()
  findAll(@Query("name") name: string) {
    return this.sizeService.findAll(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sizeService.findOne(+id);
  }

  @RoleD(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSizeDto: UpdateSizeDto) {
    return this.sizeService.update(+id, updateSizeDto);
  }
  
  @RoleD(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sizeService.remove(+id);
  }
}

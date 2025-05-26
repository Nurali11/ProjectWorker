import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CapacityService } from './capacity.service';
import { CreateCapacityDto } from './dto/create-capacity.dto';
import { UpdateCapacityDto } from './dto/update-capacity.dto';
import { ApiQuery } from '@nestjs/swagger';
import { RolesGuard } from 'src/roles/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleD } from 'src/roles/decorators/role.decorator';
import { Role } from 'src/roles/roles.enum';

@Controller('capacity')
export class CapacityController {
  constructor(private readonly capacityService: CapacityService) { }

  
  @RoleD(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createCapacityDto: CreateCapacityDto) {
    return this.capacityService.create(createCapacityDto);
  }

  @ApiQuery({
    name: "name",
    description: "Filter capacity by name",
    required: false
  })
  @Get()
  findAll(@Query("name") name: string ) {
    return this.capacityService.findAll(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.capacityService.findOne(+id);
  }

  
  @RoleD(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCapacityDto: UpdateCapacityDto) {
    return this.capacityService.update(+id, updateCapacityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.capacityService.remove(+id);
  }
}

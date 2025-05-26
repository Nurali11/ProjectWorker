import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Role } from 'src/roles/roles.enum';
import { RoleD } from 'src/roles/decorators/role.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { ApiQuery } from '@nestjs/swagger';

@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) { }


  @RoleD(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionService.create(createRegionDto);
  }

  @ApiQuery({
    name: "name",
    description: "Filter region by name",
    required: false
  })
  @Get()
  findAll(@Query("name") name: string) {
    return this.regionService.findAll(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionService.update(+id, updateRegionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regionService.remove(+id);
  }
}

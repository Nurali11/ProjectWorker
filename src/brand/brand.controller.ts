import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { RoleD } from 'src/roles/decorators/role.decorator';
import { Role } from 'src/roles/roles.enum';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @RoleD(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  @ApiQuery({
    name: "name",
    description: "Filter brand by name",
    required: false
  })
  @Get()
  findAll(@Query("name") name: string) {
    return this.brandService.findAll(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(+id);
  }

  
  @RoleD(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(+id, updateBrandDto);
  }

  
  @RoleD(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ShowcaseService } from './showcase.service';
import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';
import { RoleD } from 'src/roles/decorators/role.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Role } from 'src/roles/roles.enum';

@Controller('showcase')
export class ShowcaseController {
  constructor(private readonly showcaseService: ShowcaseService) { }

  @RoleD(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createShowcaseDto: CreateShowcaseDto) {
    return this.showcaseService.create(createShowcaseDto);
  }

  @Get()
  findAll() {
    return this.showcaseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showcaseService.findOne(+id);
  }

  @RoleD(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShowcaseDto: UpdateShowcaseDto) {
    return this.showcaseService.update(+id, updateShowcaseDto);
  }

  @RoleD(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.showcaseService.remove(+id);
  }
}

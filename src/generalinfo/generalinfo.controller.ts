import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GeneralinfoService } from './generalinfo.service';
import { CreateGeneralinfoDto } from './dto/create-generalinfo.dto';
import { UpdateGeneralinfoDto } from './dto/update-generalinfo.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/roles/roles.enum';
import { RoleD } from 'src/roles/decorators/role.decorator';

@Controller('generalinfo')
export class GeneralinfoController {
  constructor(private readonly generalinfoService: GeneralinfoService) { }

  @RoleD(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createGeneralinfoDto: CreateGeneralinfoDto) {
    return this.generalinfoService.create(createGeneralinfoDto);
  }

  @Get()
  findAll() {
    return this.generalinfoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.generalinfoService.findOne(+id);
  }

  @RoleD(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGeneralinfoDto: UpdateGeneralinfoDto) {
    return this.generalinfoService.update(+id, updateGeneralinfoDto);
  }

  @RoleD(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.generalinfoService.remove(+id);
  }
}

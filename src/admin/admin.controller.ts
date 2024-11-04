import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(AuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('add-plant')
  @Roles('ADMIN')
  async addPlant(@Body() createPlantDto: CreatePlantDto) {
    return this.adminService.addPlant(createPlantDto);
  }
}

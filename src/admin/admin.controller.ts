import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlantDto } from './dto/create-plant.dto';
import { AdminService } from './admin.service';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles('ADMIN')
  @Post('add-plant')
  async addPlant(@Body() createPlantDto: CreatePlantDto) {
    return this.adminService.addPlant(createPlantDto);
  }
}

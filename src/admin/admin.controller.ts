import { Controller, Post } from '@nestjs/common';
import { CreatePlantDto } from './dto/create-plant.dto';
import { PrismaService } from 'src/prisma.service';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('add-plant')
  async addPlant(createPlantDto: CreatePlantDto) {
    return this.adminService.addPlant(createPlantDto);
  }
}

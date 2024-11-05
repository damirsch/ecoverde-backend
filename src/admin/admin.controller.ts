import {
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ChangePlantDto } from './dto/change-plant.dto';

@Controller('admin')
@UseGuards(AuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('add-plant')
  @Roles('ADMIN')
  async addPlant(@Body() createPlantDto: CreatePlantDto) {
    return this.adminService.addPlant(createPlantDto);
  }

  @Post('change-plant')
  @Roles('ADMIN')
  async changePlant(@Body() changePlantDto: ChangePlantDto) {
    return this.adminService.changePlant(changePlantDto);
  }

  @Delete('plant/:plantId')
  @Roles('ADMIN')
  async removePlant(@Param('plantId') plantId: string) {
    return this.adminService.removePlant(plantId);
  }
}

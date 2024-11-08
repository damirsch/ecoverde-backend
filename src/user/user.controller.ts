import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AddPlantDto } from './dto/add-plant.dto';
import { WaterPlantParamDto } from './dto/water-plant.dto';
import { PlantParamDto } from './dto/plant.dto';
import { UserFromToken } from 'src/common/types';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Roles('USER')
  @Post('add-plant')
  async addPlant(
    @CurrentUser() user: UserFromToken,
    @Body() addPlantDto: AddPlantDto,
  ) {
    return this.userService.addPlantToProfile(user.sub, addPlantDto);
  }

  @Roles('USER')
  @Post('water/:userPlantId')
  async waterPlant(@Param() params: WaterPlantParamDto) {
    return this.userService.waterPlant(params.userPlantId);
  }

  @Roles('USER')
  @Get('plants')
  async getAllPlants(@CurrentUser() user: UserFromToken) {
    return this.userService.getAllPlantsInProfile(user.sub);
  }

  @Roles('USER')
  @Get('plant/:userPlantId')
  async getPlant(@Param() params: PlantParamDto) {
    return this.userService.getPlantInProfileById(+params.userPlantId);
  }

  @Roles('USER')
  @Delete('plant/:userPlantId')
  async removePlant(
    @CurrentUser() user: UserFromToken,
    @Param() params: PlantParamDto,
  ) {
    return this.userService.removePlantFromProfile(
      user.sub,
      params.userPlantId,
    );
  }
}

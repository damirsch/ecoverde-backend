import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AddPlantDto } from './dto/add-plant.dto';
import { WaterPlantParamDto } from './dto/water-plant.dto';
import { PlantParamDto } from './dto/plant.dto';
import { UserFromToken } from 'src/common/types';

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Roles('USER')
  @Post('add-plant')
  async addPlant(
    @CurrentUser() user: UserFromToken,
    @Body() addPlantDto: AddPlantDto,
  ) {
    console.log(addPlantDto);

    return this.profileService.addPlantToProfile(user.sub, addPlantDto);
  }

  @Roles('USER')
  @Post('water/:userPlantId')
  async waterPlant(@Param() params: WaterPlantParamDto) {
    return this.profileService.waterPlant(params.userPlantId);
  }

  @Roles('USER')
  @Get('plants')
  async getAllPlants(@CurrentUser() user: UserFromToken) {
    return this.profileService.getAllPlantsInProfile(user.sub);
  }

  @Roles('USER')
  @Get('plant/:userPlantId')
  async getPlant(@Param() params: PlantParamDto) {
    return this.profileService.getPlantInProfileById(+params.userPlantId);
  }
}

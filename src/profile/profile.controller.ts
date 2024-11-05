import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Roles('USER')
  @Post('add-plant')
  async addPlant(
    @CurrentUser() id: string,
    @Body('plantId') plantId: string,
    @Body('name') name: string,
  ) {
    return this.profileService.addPlantToProfile(id, plantId, name);
  }

  @Roles('USER')
  @Post('water/:userPlantId')
  async waterPlant(@Param('userPlantId') userPlantId: number) {
    return this.profileService.waterPlant(userPlantId);
  }

  @Roles('USER')
  @Get('plants')
  async getAllPlants(@CurrentUser() id: string) {
    return this.profileService.getAllPlantsInProfile(id);
  }

  @Roles('USER')
  @Get('plant/:userPlantId')
  async getPlant(@Param('userPlantId') userPlantId: number) {
    return this.profileService.getPlantInProfileById(userPlantId);
  }
}

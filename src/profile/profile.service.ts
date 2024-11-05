import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { WateringService } from 'src/watering/watering.service';

@Injectable()
export class ProfileService {
  constructor(
    private prismaService: PrismaService,
    private wateringService: WateringService,
  ) {}

  async addPlantToProfile(userId: string, plantId: string, name: string) {
    return this.prismaService.userPlant.create({
      data: {
        user_id: userId,
        plant_id: plantId,
        name,
      },
    });
  }

  async waterPlant(userPlantId: number) {
    return this.wateringService.waterPlant(userPlantId);
  }

  async getAllPlantsInProfile(userId: string) {
    return this.prismaService.userPlant.findMany({
      where: { user_id: userId },
      include: { plant: true },
    });
  }

  async getPlantInProfileById(userPlantId: number) {
    const userPlant = await this.prismaService.userPlant.findUnique({
      where: { id: userPlantId },
      include: { plant: true },
    });
    if (!userPlant) {
      throw new NotFoundException('Plant not found in profile');
    }
    return userPlant;
  }
}

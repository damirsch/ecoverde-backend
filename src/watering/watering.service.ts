import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { subDays } from 'date-fns';

@Injectable()
export class WateringService {
  constructor(private prismaService: PrismaService) {}

  async canWaterPlant(
    userPlantId: number,
    maxWaterings: number,
    daysInterval: number,
  ): Promise<boolean> {
    const fromDate = subDays(new Date(), daysInterval);
    const wateringCount = await this.prismaService.wateringHistory.count({
      where: {
        user_plant_id: userPlantId,
        watered_at: {
          gte: fromDate,
        },
      },
    });
    return wateringCount < maxWaterings;
  }

  async waterPlant(userPlantId: number) {
    const canWater = await this.canWaterPlant(userPlantId, 2, 7);
    if (!canWater) {
      throw new Error(
        'This plant has reached its watering limit for the week.',
      );
    }
    return this.prismaService.wateringHistory.create({
      data: {
        user_plant_id: userPlantId,
      },
    });
  }
}

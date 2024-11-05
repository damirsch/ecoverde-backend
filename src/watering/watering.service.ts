// src/watering/watering.service.ts
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { subDays } from 'date-fns';

@Injectable()
export class WateringService {
  constructor(private prismaService: PrismaService) {}

  async canWaterPlant(userPlantId: string): Promise<boolean> {
    const userPlant = await this.prismaService.userPlant.findUnique({
      where: { plant_id: userPlantId },
      include: { plant: true },
    });
    if (!userPlant) {
      throw new NotFoundException('Plant not found');
    }
    const { watering_interval, max_waterings_per_interval } = userPlant.plant;
    const fromDate = subDays(new Date(), watering_interval);
    const wateringCount = await this.prismaService.wateringHistory.count({
      where: {
        user_plant_id: userPlantId,
        watered_at: {
          gte: fromDate,
        },
      },
    });
    return wateringCount < max_waterings_per_interval;
  }

  async waterPlant(userPlantId: string) {
    const canWater = await this.canWaterPlant(userPlantId);
    if (!canWater) {
      throw new ForbiddenException(
        'This plant has reached its watering limit for the specified interval.',
      );
    }
    return this.prismaService.wateringHistory.create({
      data: {
        user_plant_id: userPlantId,
      },
    });
  }
}

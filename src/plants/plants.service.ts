import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PlantsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return this.prismaService.plant.findMany({
      select: { type: true, id: true, image_url: true },
    });
  }

  async getOne(id: string) {
    return this.prismaService.plant.findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
        gltf_model_url: true,
        watering_interval: true,
        max_waterings_per_interval: true,
        care_instructions: true,
        user_plants: true,
      },
    });
  }
}

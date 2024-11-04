import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePlantDto } from './dto/create-plant.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async addPlant(createPlantDto: CreatePlantDto) {
    console.log(createPlantDto);

    return this.prisma.plant.create({
      data: {
        type: createPlantDto.type,
        gltf_model_url: createPlantDto.gltf_model_url,
        care_instructions: createPlantDto.care_instructions,
        watering_interval: createPlantDto.watering_interval,
        max_waterings_per_interval: createPlantDto.max_waterings_per_interval,
      },
    });
  }
}

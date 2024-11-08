import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { ChangePlantDto } from './dto/change-plant.dto';

@Injectable()
export class AdminService {
  constructor(private prismaService: PrismaService) {}

  async addPlant(createPlantDto: CreatePlantDto) {
    const existingPlant = await this.prismaService.plant.findUnique({
      where: { type: createPlantDto.type },
    });
    if (existingPlant)
      throw new ForbiddenException('This plant is already exist');
    return this.prismaService.plant.create({
      data: {
        type: createPlantDto.type,
        gltf_model_url: createPlantDto.gltf_model_url,
        care_instructions: createPlantDto.care_instructions,
        watering_interval: createPlantDto.watering_interval,
        max_waterings_per_interval: createPlantDto.max_waterings_per_interval,
        image_url: createPlantDto.image_url,
      },
    });
  }

  async changePlant(changePlantDto: ChangePlantDto) {
    const existingPlant = this.prismaService.plant.findUnique({
      where: { type: changePlantDto.type },
    });
    if (!existingPlant)
      throw new ForbiddenException('This plant is not existed');

    return this.prismaService.plant.update({
      where: { type: changePlantDto.type },
      data: {
        gltf_model_url: changePlantDto.gltf_model_url,
        care_instructions: changePlantDto.care_instructions,
        watering_interval: changePlantDto.watering_interval,
        max_waterings_per_interval: changePlantDto.max_waterings_per_interval,
      },
    });
  }

  async removePlant(plantId: string) {
    const existingPlant = await this.prismaService.plant.findUnique({
      where: { id: plantId },
    });
    if (!existingPlant) {
      throw new NotFoundException('Plant not found in catalog');
    }
    await this.prismaService.userPlant.deleteMany({
      where: { plant_id: plantId },
    });
    return this.prismaService.plant.delete({
      where: { id: plantId },
    });
  }
}

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { WateringService } from 'src/watering/watering.service';
import { AddPlantDto } from './dto/add-plant.dto';
import { CreateUserDto } from 'src/common/dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private wateringService: WateringService,
  ) {}

  async addPlantToProfile(userId: string, addPlantDto: AddPlantDto) {
    const { name, plantId } = addPlantDto;
    const existingPlant = await this.prismaService.userPlant.findUnique({
      where: {
        user_id_plant_id: {
          user_id: userId,
          plant_id: plantId,
        },
      },
    });
    const plantFromCatalog = await this.prismaService.plant.findUnique({
      where: { id: plantId },
    });
    if (!plantFromCatalog) {
      throw new ForbiddenException('There is no plant in catalog');
    }
    if (existingPlant) {
      throw new ForbiddenException('Plant is already added');
    }
    return this.prismaService.userPlant.create({
      data: {
        user_id: userId,
        plant_id: plantId,
        name,
      },
    });
  }

  async waterPlant(userPlantId: string) {
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

  async removePlantFromProfile(userId: string, plantId: string) {
    const existingPlant = await this.prismaService.userPlant.findUnique({
      where: {
        user_id_plant_id: {
          user_id: userId,
          plant_id: plantId,
        },
      },
    });
    if (!existingPlant) {
      throw new NotFoundException('Plant not found');
    }
    return this.prismaService.userPlant.delete({
      where: {
        user_id_plant_id: {
          user_id: userId,
          plant_id: plantId,
        },
      },
    });
  }

  create(createUserDto: CreateUserDto) {
    return this.prismaService.user.create({ data: createUserDto });
  }

  findOne({ email, id }: { email?: string; id?: string }) {
    if (!id && !email) throw new UnauthorizedException('');
    if (id) {
      return this.prismaService.user.findUnique({ where: { id } });
    } else {
      return this.prismaService.user.findUnique({ where: { email } });
    }
  }

  update(email: string, updateUserDto: Partial<CreateUserDto>) {
    return this.prismaService.user.update({
      where: { email },
      data: updateUserDto,
    });
  }
}

import { PlantType } from '@prisma/client';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class AddPlantDto {
  @IsString()
  @IsNotEmpty()
  plantId: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

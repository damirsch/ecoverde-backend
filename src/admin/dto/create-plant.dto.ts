// src/admin/dto/create-plant.dto.ts
import { IsEnum, IsString } from 'class-validator';
import { PlantType } from '@prisma/client';

export class CreatePlantDto {
  @IsEnum(PlantType)
  type: PlantType;

  @IsString()
  gltf_model_url: string;

  @IsString()
  care_instructions: string;
}

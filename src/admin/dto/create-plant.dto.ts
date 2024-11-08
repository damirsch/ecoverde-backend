import { IsEnum, IsInt, IsString, Min } from 'class-validator';
import { PlantType } from '@prisma/client';

export class CreatePlantDto {
  @IsEnum(PlantType)
  @IsString()
  type: PlantType;

  @IsString()
  gltf_model_url: string;

  @IsString()
  image_url: string;

  @IsString()
  care_instructions: string;

  @IsInt()
  @Min(1)
  watering_interval: number;

  @IsInt()
  @Min(1)
  max_waterings_per_interval: number;
}

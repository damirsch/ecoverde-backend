import { IsInt } from 'class-validator';

export class PlantParamDto {
  @IsInt()
  userPlantId: number;
}

import { IsString } from 'class-validator';

export class PlantParamDto {
  @IsString()
  userPlantId: string;
}

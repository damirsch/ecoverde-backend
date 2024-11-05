import { IsInt } from 'class-validator';

export class WaterPlantParamDto {
  @IsInt()
  userPlantId: number;
}

import { IsString } from 'class-validator';

export class WaterPlantParamDto {
  @IsString()
  userPlantId: string;
}

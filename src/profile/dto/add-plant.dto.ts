import { IsString, IsNotEmpty } from 'class-validator';

export class AddPlantDto {
  @IsString()
  @IsNotEmpty()
  plantId: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

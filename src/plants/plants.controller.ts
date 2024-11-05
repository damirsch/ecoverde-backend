import { Controller, Get, Param } from '@nestjs/common';
import { PlantsService } from './plants.service';

@Controller('plants')
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Get('all')
  all() {
    return this.plantsService.getAll();
  }

  @Get(':id')
  one(@Param('id') id: string) {
    return this.plantsService.getOne(id);
  }
}

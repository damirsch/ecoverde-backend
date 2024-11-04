import { Controller, Post } from '@nestjs/common';

@Controller('admin')
export class AdminController {
  @Post('add-plant')
  addPlant() {}
}

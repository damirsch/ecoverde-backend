import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TelegramService } from './telegram.service';
import { WateringReminderService } from './watering-reminder.service';
import { PrismaService } from 'src/prisma.service';
import { WateringService } from 'src/watering/watering.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [
    TelegramService,
    WateringReminderService,
    WateringService,
    PrismaService,
  ],
  exports: [TelegramService, PrismaService],
})
export class TelegramModule {}

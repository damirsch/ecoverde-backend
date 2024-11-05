import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.service';
import { TelegramService } from './telegram.service';
import { addDays, isBefore } from 'date-fns';

@Injectable()
export class WateringReminderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly telegramService: TelegramService,
  ) {}

  @Cron('* * * * *') // для тестирования напоминание каждую минуту
  async sendWateringReminders() {
    const plantsToWater = await this.prismaService.userPlant.findMany({
      include: { plant: true, user: true },
    });

    for (const plant of plantsToWater) {
      const {
        plant_id,
        name,
        last_watered_at,
        plant: { watering_interval },
        user,
      } = plant;

      const nextWateringDate = last_watered_at
        ? addDays(last_watered_at, watering_interval)
        : new Date(0);
      console.log(nextWateringDate);

      if (isBefore(nextWateringDate, new Date()) && user?.telegram_chat_id) {
        await this.telegramService.sendMessageWithWateringOption(
          user.telegram_chat_id,
          `Напоминание: Пора полить ваше растение "${name}".`,
          plant_id,
        );
      }
    }
  }
}

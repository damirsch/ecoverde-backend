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

  @Cron('* * * * *')
  async sendWateringReminders() {
    const plantsToWater = await this.prismaService.userPlant.findMany({
      include: {
        plant: true,
        user: true,
      },
    });

    for (const plant of plantsToWater) {
      const {
        plant_id,
        name,
        plant: { watering_interval },
        user,
      } = plant;
      const lastWatering = await this.prismaService.wateringHistory.findFirst({
        where: { user_plant_id: plant_id },
        orderBy: { watered_at: 'desc' },
      });

      const lastWateredAt = lastWatering
        ? lastWatering.watered_at
        : new Date(0);
      const nextWateringDate = addDays(lastWateredAt, watering_interval);

      console.log(
        `Следующая дата полива для растения "${name}":`,
        nextWateringDate,
      );

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

import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.service';
import { TelegramService } from './telegram.service';
import { addDays, isSameDay, isPast, startOfToday } from 'date-fns';

@Injectable()
export class WateringReminderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly telegramService: TelegramService,
  ) {}

  @Cron('0 8 * * *') // Запуск каждый день в 8 утра
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

      if (
        (isSameDay(nextWateringDate, startOfToday()) ||
          isPast(nextWateringDate)) &&
        user?.telegram_chat_id
      ) {
        const message =
          await this.telegramService.sendMessageWithWateringOption(
            user.telegram_chat_id,
            `Напоминание: Пора полить ваше растение "${name}".`,
            plant_id,
          );
        await this.prismaService.notification.create({
          data: {
            user_plant_id: plant_id,
            message_id: message.message_id,
            chat_id: user.telegram_chat_id,
          },
        });
      }
    }
  }
}

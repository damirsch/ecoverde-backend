// watering-reminder.service.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.service';
import { TelegramService } from './telegram.service';

@Injectable()
export class WateringReminderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly telegramService: TelegramService,
  ) {}

  @Cron('* * * * *') // каждый раз в минуту (для теста)
  async sendWateringReminders() {
    console.log('asdw');

    const plantsToWater = await this.prismaService.userPlant.findMany({
      where: {
        last_watered_at: {
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      include: { user: true },
    });
    console.log(plantsToWater);

    for (const plant of plantsToWater) {
      const { user_id, id: plantId, name } = plant;
      const user = await this.prismaService.user.findUnique({
        where: { id: user_id },
      });
      console.log(plantId);

      if (user?.telegram_chat_id) {
        await this.telegramService.sendMessageWithWateringOption(
          user.telegram_chat_id,
          `Напоминание: Пора полить ваше растение "${name}".`,
          String(plantId),
        );
      }
    }
  }
}

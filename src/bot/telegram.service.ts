import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { PrismaService } from 'src/prisma.service';
import { WateringService } from 'src/watering/watering.service';

@Injectable()
export class TelegramService {
  private bot: TelegramBot;

  constructor(
    private readonly prisma: PrismaService,
    private readonly wateringService: WateringService,
  ) {
    this.bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id.toString();
      const username = msg.from.username;

      if (!username) {
        return this.bot.sendMessage(
          chatId,
          'Не удалось получить ваш никнейм. Пожалуйста, установите никнейм в настройках Telegram.',
        );
      }

      let user = await this.prisma.user.findUnique({
        where: { telegram_name: username },
      });

      if (!user) {
        return this.bot.sendMessage(
          chatId,
          'Введите свой никнейм в настройках профиля на сайте, чтобы связать аккаунт с ботом.',
        );
      }

      if (!user.telegram_chat_id) {
        return this.bot.sendMessage(
          chatId,
          `Ваша почта на сайте: ${user.email}. Хотите ли вы привязать Telegram бота к аккаунту?`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: 'Да', callback_data: 'confirm_link' },
                  { text: 'Нет', callback_data: 'cancel_link' },
                ],
              ],
            },
          },
        );
      }

      this.bot.sendMessage(
        chatId,
        'С возвращением! Ваш Telegram ID уже сохранен.',
      );
    });

    this.bot.on('callback_query', async (callbackQuery) => {
      const chatId = callbackQuery.message.chat.id.toString();
      const username = callbackQuery.from.username;
      const messageId = callbackQuery.message.message_id;

      if (!username) {
        return this.bot.sendMessage(
          chatId,
          'Не удалось получить ваш никнейм. Пожалуйста, установите никнейм в настройках Telegram.',
        );
      }

      let user = await this.prisma.user.findUnique({
        where: { telegram_name: username },
      });

      if (!user || !user.telegram_chat_id)
        return this.bot.sendMessage(chatId, 'Invalid user');

      if (callbackQuery.data.startsWith('water_plant_')) {
        const userPlantId = callbackQuery.data.split('_')[2];
        try {
          await this.wateringService.waterPlant(userPlantId);
          const notifications = await this.prisma.notification.findMany({
            where: { user_plant_id: userPlantId },
          });
          for (const notification of notifications) {
            await this.bot.editMessageReplyMarkup(
              { inline_keyboard: [] },
              {
                chat_id: notification.chat_id,
                message_id: notification.message_id,
              },
            );
          }
          this.bot.sendMessage(chatId, 'Растение успешно полито!');
          await this.prisma.notification.deleteMany({
            where: { user_plant_id: userPlantId },
          });
        } catch (error) {
          this.bot.sendMessage(chatId, `Ошибка: ${error.message}`);
        }
      }
    });
  }

  async sendMessageWithWateringOption(
    chatId: string,
    message: string,
    userPlantId: string,
  ) {
    return this.bot.sendMessage(Number(chatId), message, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Я уже полил растение',
              callback_data: `water_plant_${userPlantId}`,
            },
          ],
        ],
      },
    });
  }

  async sendMessage(chatId: string, message: string) {
    return this.bot.sendMessage(Number(chatId), message);
  }
}

import { Telegraf } from 'telegraf';
import { ConfigService } from './config/config.service';
import { DatabaseService } from './services/database.service';
import { BotService } from './services/bot.service';

// Load environment variables
const configService = new ConfigService();
const bot = new Telegraf(configService.get('BOT_TOKEN'));

// Initialize database connection
const databaseService = new DatabaseService();
let channelsCollection;

(async () => {
    const client = await databaseService.connect();
    channelsCollection = await databaseService.getChannelsCollection();
    const botService = new BotService(channelsCollection, configService, bot);

    bot.start((ctx) => {
        ctx.reply('Привіт! Виберіть опцію:', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Додати канал', callback_data: 'add_channel' }],
                    [{ text: 'Запланувати задачу', callback_data: 'schedule_task' }],
                    [{ text: 'Отримати посилання на канал', callback_data: 'get_channel_link' }],
                ],
            },
        });
    });

    bot.action('add_channel', (ctx) => botService.addChannel(ctx));
    bot.action('get_channel_link', (ctx) => botService.getChannelLink(ctx));
    bot.action('schedule_task', (ctx) => botService.scheduleTask(ctx));
    bot.command('get_channel_info', (ctx) => botService.getChannelInfo(ctx));

    bot.launch();
})();

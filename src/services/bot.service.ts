import {Context, Telegraf} from 'telegraf';
import { Collection } from 'mongodb';
import { IBotService } from './bot.service.interface';
import { ConfigService } from '../config/config.service';
import { handleError } from '../utils/errorHandling';
import axios from 'axios';

export class BotService implements IBotService {
    private channelsCollection: Collection;
    private configService: ConfigService;
    private bot: Telegraf<Context>;
    private userState: Map<number, { step: string, messageText?: string }> = new Map();

    constructor(channelsCollection: Collection, configService: ConfigService, bot: Telegraf<Context>) {
        this.channelsCollection = channelsCollection;
        this.configService = configService;
        this.bot = bot;
    }

    async addChannel(ctx): Promise<void> {
        try {
            ctx.reply('Введіть ID каналу:');

            this.bot.on('text', async (ctx) => {
                const channelId = ctx.message.text;

                const isAdmin = await ctx.telegram.getChatAdministrators(channelId)
                    .then(admins => admins.some(admin => admin.user.id === ctx.botInfo?.id))
                    .catch(() => false);

                if (isAdmin) {
                    await this.channelsCollection.insertOne({ channelId });
                    ctx.reply('Канал успішно доданий!');
                } else {
                    ctx.reply('Бот не є адміністратором цього каналу.');
                }
            });
        } catch (error) {
            console.error('Error in addChannelService:', error);
            ctx.reply('Виникла помилка при додаванні каналу.');
        }
    }

    async getChannelLink(ctx: Context): Promise<void> {
        try {
            const channel = await this.channelsCollection.findOne();
            if (!channel) {
                ctx.reply('Канал не знайдений.');
                return;
            }

            const inviteLink = await ctx.telegram.exportChatInviteLink(channel.channelId);
            ctx.reply(`Ваше посилання на канал: ${inviteLink}`);
        } catch (error) {
            console.error('Error in getChannelLinkService:', error);
            handleError(ctx, error);
        }
    }

    async scheduleTask(ctx): Promise<void> {
        try {
            // ctx.reply('Введіть текст повідомлення:');
            //
            // this.bot.on('text', async (ctx) => {
            //     const messageText = ctx.message.text;
            //
            //     ctx.reply('Через скільки хвилин відправити повідомлення?');
            //
            //     this.bot.on('text', async (ctx) => {
            //         const minutes = parseInt(ctx.message.text);
            //         if (isNaN(minutes)) {
            //             return ctx.reply('Некоректне значення часу.');
            //         }
            //
            //         const delay = minutes * 60 * 1000;
            //
            //         setTimeout(async () => {
            //             const channel = await this.channelsCollection.findOne();
            //             if (channel) {
            //                 await ctx.telegram.sendMessage(channel.channelId, messageText);
            //                 ctx.reply('Повідомлення успішно надіслано!');
            //             } else {
            //                 ctx.reply('Канал не знайдений.');
            //             }
            //         }, delay);
            //
            //         ctx.reply(`Повідомлення буде відправлено через ${minutes} хвилин.`);
            //     });
            // });


            ctx.reply('Введіть текст повідомлення:');
            this.bot.on('text', async (ctx) => {
                const userId = ctx.from?.id;
                if (!userId) return;

                const state = this.userState.get(userId) || {step: 'waitingForMessage'};

                if (state.step === 'waitingForMessage') {
                    const messageText = ctx.message?.text;
                    if (!messageText) {
                        ctx.reply('Текст повідомлення не може бути порожнім.');
                        return;
                    }
                    ctx.reply('Через скільки хвилин відправити повідомлення?');
                    this.userState.set(userId, {step: 'waitingForTime', messageText});
                } else if (state.step === 'waitingForTime') {
                    const minutes = parseInt(ctx.message?.text || '0');
                    if (isNaN(minutes)) {
                        ctx.reply('Некоректне значення часу.');
                        return;
                    }

                    const delay = minutes * 60 * 1000;
                    const messageText = state.messageText;

                    setTimeout(async () => {
                        const channel = await this.channelsCollection.findOne();
                        if (channel) {
                            await ctx.telegram.sendMessage(channel.channelId, messageText);
                            ctx.reply('Повідомлення успішно надіслано!');
                        } else {
                            ctx.reply('Канал не знайдений.');
                        }
                    }, delay);

                    ctx.reply(`Повідомлення буде відправлено через ${minutes} хвилин.`);
                    this.userState.delete(userId);
                }
            });
        } catch (error) {
            console.error('Error in scheduleTaskService:', error);
           handleError(ctx, error);
        }
    }

    async getChannelInfo(ctx): Promise<void> {
        try {
            const channel = await this.channelsCollection.findOne();
            if (!channel) {
                ctx.reply('Канал не знайдений.');
                return;
            }

            const channelInfo = await ctx.telegram.getChat(channel.channelId);
            const membersCount = await ctx.telegram.getChatMembersCount(channel.channelId);

            ctx.reply(`Канал: ${channelInfo.title}\nКількість учасників: ${membersCount}`);
        } catch (error) {
            console.error('Error in getChannelInfoService:', error);
            ctx.reply('Виникла помилка при отриманні інформації про канал.');
        }
    }
}

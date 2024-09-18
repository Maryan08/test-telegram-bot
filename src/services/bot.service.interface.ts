import { Context } from 'telegraf';

export interface IBotService {
    addChannel(ctx: Context): Promise<void>;
    getChannelLink(ctx: Context): Promise<void>;
    scheduleTask(ctx: Context): Promise<void>;
    getChannelInfo(ctx: Context): Promise<void>;
}
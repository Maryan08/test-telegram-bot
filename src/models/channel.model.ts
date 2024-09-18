import { Schema, model } from 'mongoose';

const channelSchema = new Schema({
    channelId: { type: String, required: true },
    name: { type: String, required: true },
});

export const ChannelModel = model('Channel', channelSchema);
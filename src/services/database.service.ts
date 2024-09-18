import { MongoClient } from 'mongodb';
import { ConfigService } from '../config/config.service';

export class DatabaseService {
    private client: MongoClient;
    private configService: ConfigService;

    constructor() {
        this.configService = new ConfigService();
        this.client = new MongoClient(this.configService.get('MONGO_URI'));
    }

    async connect(): Promise<MongoClient> {
        try {
            await this.client.connect();
            return this.client;
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw new Error('Failed to connect to MongoDB');
        }
    }

    async getChannelsCollection() {
        const db = this.client.db('telegram_bot');
        return db.collection('channels');
    }
}

import * as dotenv from 'dotenv';

dotenv.config();

export class ConfigService {
    get(key: string): string {
        const value = process.env[key];
        if (!value) {
            throw new Error(`Config value for ${key} not found.`);
        }
        return value;
    }
}
import 'dotenv/config';
import {Config} from '../../config'

export const DiscordRequests = {
    execute: async (endpoint: string, options: any): Promise<Response> => {
        // append endpoint to root API URL
        const url = 'https://discord.com/api/v10/' + endpoint;
        // Stringify payloads
        if (options.body) options.body = JSON.stringify(options.body);
        // Use fetch to make requests
        const res = await fetch(url, {
            headers: {
                Authorization: `Bot ${Config.botToken}`,
                'Content-Type': 'application/json; charset=UTF-8',
                'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
            },
            ...options
        });
        // throw API errors
        if (!res.ok) {
            const data = await res.json();
            throw new Error(JSON.stringify(data));
        }
        // return original response
        return res;
    }
}
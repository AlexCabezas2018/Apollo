import 'dotenv/config';

export async function DiscordRequest(endpoint: string, options: any) {
    // append endpoint to root API URL
    const url = 'https://discord.com/api/v10/' + endpoint;
    // Stringify payloads
    if (options.body) options.body = JSON.stringify(options.body);
    // Use fetch to make requests
    const res = await fetch(url, {
        headers: {
            Authorization: `Bot ${process.env.BOT_TOKEN}`,
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

export async function installCommands(appId: string) {
    // API endpoint to overwrite global commands
    console.log('Installing commands...');

    const endpoint = `applications/${appId}/commands`;

    const commands: any[] = [
        {
            name: 'hello',
            description: 'It just a test command',
            type: 1,
            integration_types: [0, 1],
            contexts: [0, 1, 2],
        }
    ];

    await DiscordRequest(endpoint, {method: 'PUT', body: commands});
}
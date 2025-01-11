import {Client, Events, GatewayIntentBits} from 'discord.js';
import {Config} from "../config";

export const Server = {
    start: async (): Promise<void> => {
        const client = new Client({intents: [GatewayIntentBits.Guilds]});

        client.on(Events.InteractionCreate, async interaction => {
            if (!interaction.isChatInputCommand()) return;

            if (interaction.commandName == "hello") {
                await interaction.reply("Hello World!!")
            } else if (interaction.commandName == "play") {
                console.log(interaction.options.getString("url"))
                await interaction.reply("I'm on it!!")
            }
        });

        await client.login(Config.botToken)
    }
}
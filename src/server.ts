import {Client, Events, GatewayIntentBits} from 'discord.js';
import {Config} from "../config";
import PlayCommand from "./commands/PlayCommand";

export const Server = {
    start: async (): Promise<void> => {
        const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]});

        client.on(Events.InteractionCreate, async interaction => {
            if (!interaction.isChatInputCommand()) return;

            if (interaction.commandName == "hello") {
                await interaction.reply("Hello World!!")
            } else if (interaction.commandName == "play") {
                await new PlayCommand().execute(interaction)
            }
        });

        await client.login(Config.botToken)
    }
}
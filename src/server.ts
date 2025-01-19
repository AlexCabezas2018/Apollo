import { Client, Events, GatewayIntentBits } from 'discord.js'
import { Config } from '../config'
import { COMMANDS } from './commands/AvailableCommands'
import { Messages, MessageType } from "./utils/Messages";
import { GuildPreferences } from "./preferences/GuildPreferences";

export const Server = {
    start: async (): Promise<void> => {
        const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] })

        client.on(Events.InteractionCreate, async interaction => {
            const preferences = GuildPreferences.getInstance().getPreferences(interaction.guildId)
            if (!interaction.isChatInputCommand()) return

            const command = COMMANDS.get(interaction.commandName)
            if (command == null) {

                await interaction.reply(Messages.get(preferences, MessageType.COMMAND_NOT_FOUND))
                return
            }

            await command.execute(client, interaction)
        })

        await client.login(Config.botToken)
    }
}

import { Client, Events, GatewayIntentBits } from 'discord.js'
import { Config } from '../config'
import { COMMANDS } from './commands/AvailableCommands'

export const Server = {
    start: async (): Promise<void> => {
        const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] })

        client.on(Events.InteractionCreate, async interaction => {
            if (!interaction.isChatInputCommand()) return

            const command = COMMANDS.get(interaction.commandName)
            if (command == null) {
                await interaction.reply('Command not found.')
                return
            }

            command.execute(client, interaction)
        })

        await client.login(Config.botToken)
    }
}

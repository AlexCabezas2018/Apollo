import { Client, CommandInteraction } from 'discord.js'
import Command from './Command'
import { Messages, MessageType } from "../utils/Messages";
import { GuildPreferences } from "../preferences/GuildPreferences";

export default class HelloCommand extends Command {
    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        const preferences = GuildPreferences.getInstance().getPreferences(interaction.guildId)
        await interaction.reply(Messages.get(preferences, MessageType.HELLO_COMMAND_SUCCESS_RESPONSE))
    }
}

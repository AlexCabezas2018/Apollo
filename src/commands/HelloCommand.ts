import { Client, CommandInteraction } from 'discord.js'
import Command from './Command'
import { Messages, MessageType } from "../utils/Messages";

export default class HelloCommand extends Command {
    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        await interaction.reply(Messages.get(MessageType.HELLO_COMMAND_SUCCESS_RESPONSE))
    }
}

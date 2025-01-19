import Command, { CommandInput } from './Command'
import { Messages, MessageType } from "../utils/Messages";

export default class HelloCommand extends Command {
    async run(input: CommandInput): Promise<void> {
        const { guildPreferences, interaction } = input;
        await interaction.reply(Messages.get(guildPreferences, MessageType.HELLO_COMMAND_SUCCESS_RESPONSE))
    }
}

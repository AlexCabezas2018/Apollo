import { MessageFlagsBitField } from 'discord.js'
import Command, { CommandInput } from './Command'
import AudioPlayers from '../audioplayer/AudioPlayers'
import { Messages } from "../utils/Messages";
import { MessageType } from "../utils/MessageTypes";

export default class ResumeCommand extends Command {
    async run(input: CommandInput): Promise<void> {
        const { interaction, guildPreferences, interactionGuild } = input;

        const audioPlayer = AudioPlayers.getInstance().getPlayer(interactionGuild.id);
        if ((audioPlayer == null) || !audioPlayer.resume()) {
            await interaction.reply({
                content: Messages.get(guildPreferences, MessageType.RESUME_COMMAND_NOTHING_TO_RESUME),
                flags: MessageFlagsBitField.Flags.Ephemeral
            })

            return;
        }

        await interaction.reply(Messages.get(guildPreferences, MessageType.RESUME_COMMAND_SUCCESS_RESPONSE));
    }
}

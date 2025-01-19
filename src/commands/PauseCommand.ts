import { MessageFlagsBitField } from 'discord.js'
import Command, { CommandInput } from './Command'
import AudioPlayers from '../audioplayer/AudioPlayers'
import { Messages, MessageType } from "../utils/Messages";

export default class PauseCommand extends Command {
    async run(input: CommandInput): Promise<void> {
        const { interaction, interactionGuild, guildPreferences } = input;

        const audioPlayer = AudioPlayers.getInstance().getPlayer(interactionGuild.id)
        if ((audioPlayer == null) || !audioPlayer.pause()) {
            await interaction.reply({
                content: Messages.get(guildPreferences, MessageType.PAUSE_COMMAND_NOTHING_TO_PAUSE),
                flags: MessageFlagsBitField.Flags.Ephemeral
            })

            return
        }

        await interaction.reply(Messages.get(guildPreferences, MessageType.PAUSE_COMMAND_SUCCESS_RESPONSE));
    }
}

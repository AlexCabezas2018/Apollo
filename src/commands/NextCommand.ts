import { MessageFlagsBitField } from 'discord.js'
import Command, { CommandInput } from './Command'
import AudioPlayers from '../audioplayer/AudioPlayers'
import { Messages, MessageType } from "../utils/Messages";

export default class NextCommand extends Command {
    async run(input: CommandInput): Promise<void> {
        const { interaction, interactionGuild, guildPreferences } = input;

        const audioPlayer = AudioPlayers.getInstance().getPlayer(interactionGuild.id)
        if (!audioPlayer) {
            await interaction.reply({
                content: Messages.get(guildPreferences, MessageType.NEXT_COMMAND_NO_PLAYER),
                flags: MessageFlagsBitField.Flags.Ephemeral
            });

            return;
        }

        if (audioPlayer.queue.length == 0) {
            await interaction.reply({
                content: Messages.get(guildPreferences, MessageType.NEXT_COMMAND_NO_SONGS_IN_QUEUE),
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
            audioPlayer.stop();
            return;
        }

        await audioPlayer.play(interaction);
    }
}

import Command, { CommandInput } from './Command'
import AudioPlayers from '../audioplayer/AudioPlayers'
import { AudioData } from "../provider/AudioProvider";
import { Messages, MessageType } from "../utils/Messages";
import { MessageFlagsBitField } from "discord.js";

export default class QueueCommand extends Command {
    async run(input: CommandInput): Promise<void> {
        const { interactionGuild, interaction, guildPreferences } = input;
        const player = AudioPlayers.getInstance().getPlayer(interactionGuild.id);
        if (!player) {
            await interaction.reply({
                content: Messages.get(
                    guildPreferences,
                    MessageType.QUEUE_COMMAND_NO_QUEUE_RESPONSE
                ),
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
            return;
        }

        const queueList = this.queueToString(player.queue);
        if (!queueList) {
            await interaction.reply({
                content: Messages.get(
                    guildPreferences,
                    MessageType.QUEUE_COMMAND_NO_QUEUE_RESPONSE
                ),
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
            return;
        }

        await interaction.reply({
            content: Messages.getAndReplace(
                guildPreferences,
                MessageType.QUEUE_COMMAND_SUCCESS_RESPONSE,
                queueList
            ),
            flags: MessageFlagsBitField.Flags.Ephemeral
        });
    }

    private queueToString(queue: AudioData[]): string | undefined {
        if (queue.length == 0) return undefined;

        return queue.reduce((acc, song, currentIndex) => {
            if (currentIndex == 0) {
                return acc + `${currentIndex + 1} (next) - ${song.title}\n`
            }
            return acc + `${currentIndex + 1} - ${song.title}\n`;
        }, "");
    }
}
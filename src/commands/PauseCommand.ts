import { Client, CommandInteraction, MessageFlagsBitField } from 'discord.js'
import Command from './Command'
import AudioPlayers from '../audioplayer/AudioPlayers'
import { getVoiceConnection } from '@discordjs/voice'
import { Messages, MessageType } from "../utils/Messages";

export default class PauseCommand extends Command {
    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        if ((interaction.guild == null) || interaction.guildId == null || (interaction.member == null)) {
            await interaction.reply(Messages.get(MessageType.UNEXPECTED_ERROR))
            return
        }

        // @ts-expect-error
        const channel = interaction.member.voice.channel

        const voiceConnection = getVoiceConnection(interaction.guildId)

        if (((voiceConnection != null) && voiceConnection.joinConfig.channelId != channel.id) || !channel) {
            await interaction.reply({
                content: Messages.get(MessageType.USER_NOT_IN_VOICE_CHANNEL),
                flags: MessageFlagsBitField.Flags.Ephemeral
            })
            return
        }

        const audioPlayer = AudioPlayers.getInstance().getPlayer(interaction.guildId)
        if ((audioPlayer == null) || !audioPlayer.pause()) {
            await interaction.reply({
                content: Messages.get(MessageType.PAUSE_COMMAND_NOTHING_TO_PAUSE),
                flags: MessageFlagsBitField.Flags.Ephemeral
            })

            return
        }

        await interaction.reply(Messages.get(MessageType.PAUSE_COMMAND_SUCCESS_RESPONSE));
    }
}

import { ChatInputCommandInteraction, Client, MessageFlagsBitField } from 'discord.js'
import { getVoiceConnection } from '@discordjs/voice'

import Command from './Command'
import AudioPlayers from '../audioplayer/AudioPlayers'
import { Messages, MessageType } from "../utils/Messages";
import { GuildPreferences } from "../preferences/GuildPreferences";

export default class ResumeCommand extends Command {
    async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<void> {
        const preferences = GuildPreferences.getInstance().getPreferences(interaction.guildId)

        if ((interaction.guild == null) || interaction.guildId == null || (interaction.member == null)) {
            await interaction.reply(Messages.get(preferences, MessageType.UNEXPECTED_ERROR))
            return
        }

        // @ts-expect-error
        const channel = interaction.member.voice.channel

        const voiceConnection = getVoiceConnection(interaction.guildId)

        if (((voiceConnection != null) && voiceConnection.joinConfig.channelId != channel.id) || !channel) {
            await interaction.reply({
                content: Messages.get(preferences, MessageType.USER_NOT_IN_VOICE_CHANNEL),
                flags: MessageFlagsBitField.Flags.Ephemeral
            })
            return
        }

        const audioPlayer = AudioPlayers.getInstance().getPlayer(interaction.guildId)
        if ((audioPlayer == null) || !audioPlayer.resume()) {
            await interaction.reply({
                content: Messages.get(preferences, MessageType.RESUME_COMMAND_NOTHING_TO_RESUME),
                flags: MessageFlagsBitField.Flags.Ephemeral
            })

            return;
        }

        await interaction.reply(Messages.get(preferences, MessageType.RESUME_COMMAND_SUCCESS_RESPONSE));
    }
}

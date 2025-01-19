import { ChatInputCommandInteraction, Client, MessageFlagsBitField } from 'discord.js'
import { getVoiceConnection } from '@discordjs/voice'

import Command from './Command'
import AudioPlayers from '../audioplayer/AudioPlayers'

export default class ResumeCommand extends Command {
    async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<void> {
        if ((interaction.guild == null) || interaction.guildId == null || (interaction.member == null)) {
            await interaction.reply('Unexpected problem. Talk to a bot admin.')
            return
        }

        // @ts-expect-error
        const channel = interaction.member.voice.channel

        const voiceConnection = getVoiceConnection(interaction.guildId)

        if (((voiceConnection != null) && voiceConnection.joinConfig.channelId != channel.id) || !channel) {
            await interaction.reply({
                content: "You can't resume me if you are not in the same voice channel as me!",
                flags: MessageFlagsBitField.Flags.Ephemeral
            })
            return;
        }

        const audioPlayer = AudioPlayers.getInstance().getPlayer(interaction.guildId)
        if ((audioPlayer == null) || !audioPlayer.resume()) {
            await interaction.reply({
                content: 'Nothing to resume! Try /play [url]',
                flags: MessageFlagsBitField.Flags.Ephemeral
            })

            return;
        }

        await interaction.reply('Resumed!');
    }
}

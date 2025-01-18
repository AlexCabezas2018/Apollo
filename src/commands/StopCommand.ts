import { Client, CommandInteraction, MessageFlagsBitField } from 'discord.js'
import Command from './Command'
import AudioPlayers from '../audioplayer/AudioPlayers'
import { getVoiceConnection } from '@discordjs/voice'

export default class StopCommand extends Command {
    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        if ((interaction.guild == null) || interaction.guildId == null || (interaction.member == null)) {
            await interaction.reply('Unexpected problem. Talk to a bot admin.')
            return
        }

        // @ts-expect-error
        const channel = interaction.member.voice.channel

        const voiceConnection = getVoiceConnection(interaction.guildId)

        if (((voiceConnection != null) && voiceConnection.joinConfig.channelId != channel.id) || !channel) {
            await interaction.reply({
                content: "You can't stop me if you are not in a voice channel!",
                flags: MessageFlagsBitField.Flags.Ephemeral
            })
            return
        }

        const audioPlayer = AudioPlayers.getInstance().getPlayer(interaction.guildId)
        if ((audioPlayer == null) || !audioPlayer.stop()) {
            await interaction.reply({
                content: 'Nothing to stop! Try /play [url]',
                flags: MessageFlagsBitField.Flags.Ephemeral
            })

            return
        }

        await interaction.reply('See you next time!')
    }
}

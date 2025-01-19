import { Client, CommandInteraction, MessageFlagsBitField } from 'discord.js'
import Command from './Command'
import AudioPlayers from '../audioplayer/AudioPlayers'
import { getVoiceConnection } from '@discordjs/voice'

export default class PauseCommand extends Command {
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
                content: "You can't pause me if you are not in the same voice channel as me!",
                flags: MessageFlagsBitField.Flags.Ephemeral
            })
            return
        }

        const audioPlayer = AudioPlayers.getInstance().getPlayer(interaction.guildId)
        if ((audioPlayer == null) || !audioPlayer.pause()) {
            await interaction.reply({
                content: 'Nothing to pause! Try /play [url]',
                flags: MessageFlagsBitField.Flags.Ephemeral
            })

            return
        }

        await interaction.reply('Paused!');
    }
}

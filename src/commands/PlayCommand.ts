import { CommandInteraction, MessageFlagsBitField } from 'discord.js'
import { createAudioResource, joinVoiceChannel } from '@discordjs/voice'

import Command, { CommandInput } from './Command'
import DiscordAudioPlayer from '../audioplayer/DiscordAudioPlayer'
import AudioPlayers from '../audioplayer/AudioPlayers'
import { AudioProviderResponseStatus, YoutubeAudioProvider } from '../provider/YoutubeAudioProvider'
import { Messages, MessageType } from "../utils/Messages";

export default class PlayCommand extends Command {
    async run(input: CommandInput): Promise<void> {
        const { interaction, guildPreferences, channelId, voiceConnection, interactionGuild } = input

        const url = this.getUrl(interaction)
        if (!url) {
            await interaction.reply({
                content: Messages.get(guildPreferences, MessageType.PLAY_COMMAND_URL_NOT_PROVIDED),
                flags: MessageFlagsBitField.Flags.Ephemeral
            })
            return
        }

        const audioProviderResponse = await YoutubeAudioProvider.getAudio(url)
        if (audioProviderResponse.status != AudioProviderResponseStatus.SUCCESS) {
            await interaction.reply({
                content: Messages.get(guildPreferences, MessageType.PLAY_COMMAND_RESOURCE_ERROR),
                flags: MessageFlagsBitField.Flags.Ephemeral
            })
            return
        }

        const newVoiceConnection = voiceConnection || joinVoiceChannel({
            channelId: channelId,
            guildId: interactionGuild.id,
            adapterCreator: interactionGuild.voiceAdapterCreator
        })

        const audioResource = createAudioResource(audioProviderResponse.audioData)
        const cachedAudioPlayer = AudioPlayers.getInstance().getPlayer(interactionGuild.id)

        if (cachedAudioPlayer == null) {
            const audioPlayer = new DiscordAudioPlayer(newVoiceConnection)
            AudioPlayers.getInstance().addPlayer(interactionGuild.id, audioPlayer)
            audioPlayer.play(audioResource)
        } else {
            cachedAudioPlayer.update(newVoiceConnection)
            cachedAudioPlayer.play(audioResource)
        }

        await interaction.reply(
            Messages.getAndReplace(
                guildPreferences,
                MessageType.PLAY_COMMAND_SUCCESS_RESPONSE,
                audioProviderResponse.name
            )
        );
    }

    private getUrl(interaction: CommandInteraction): string | undefined {
        return String(
            interaction.options.data
                .find(option => option.name == 'url')?.value
        );
    }
}

import { ChatInputCommandInteraction, Client, MessageFlagsBitField } from 'discord.js'
import { createAudioResource, getVoiceConnection, joinVoiceChannel } from '@discordjs/voice'

import Command from './Command'
import DiscordAudioPlayer from '../audioplayer/DiscordAudioPlayer'
import AudioPlayers from '../audioplayer/AudioPlayers'
import { AudioProviderResponseStatus, YoutubeAudioProvider } from '../provider/YoutubeAudioProvider'
import { Messages, MessageType } from "../utils/Messages";
import { GuildPreferences } from "../preferences/GuildPreferences";

export default class PlayCommand extends Command {
    async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<void> {
        const preferences = GuildPreferences.getInstance().getPreferences(interaction.guildId)

        if ((interaction.guild == null) || interaction.guildId == null || (interaction.member == null)) {
            await interaction.reply(Messages.get(preferences, MessageType.UNEXPECTED_ERROR))
            return
        }

        // @ts-expect-error
        const channel = interaction.member.voice.channel

        if (!channel) {
            await interaction.reply({
                content: Messages.get(preferences, MessageType.USER_NOT_IN_VOICE_CHANNEL),
                flags: MessageFlagsBitField.Flags.Ephemeral
            })
            return
        }

        let voiceConnection = getVoiceConnection(interaction.guildId)

        if ((voiceConnection != null) && voiceConnection.joinConfig.channelId != channel.id) {
            await interaction.reply({
                content: Messages.get(preferences, MessageType.BOT_ALREADY_IN_USE),
                flags: MessageFlagsBitField.Flags.Ephemeral
            })
            return
        }

        const url = this.getUrl(interaction)
        if (!url) {
            await interaction.reply({
                content: Messages.get(preferences, MessageType.PLAY_COMMAND_URL_NOT_PROVIDED),
                flags: MessageFlagsBitField.Flags.Ephemeral
            })
            return
        }

        const audioProviderResponse = await YoutubeAudioProvider.getAudio(url)
        if (audioProviderResponse.status != AudioProviderResponseStatus.SUCCESS) {
            await interaction.reply({
                content: Messages.get(preferences, MessageType.PLAY_COMMAND_RESOURCE_ERROR),
                flags: MessageFlagsBitField.Flags.Ephemeral
            })
            return
        }

        voiceConnection = voiceConnection || joinVoiceChannel({
            channelId: channel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild?.voiceAdapterCreator
        })

        const audioResource = createAudioResource(audioProviderResponse.audioData)

        const cachedAudioPlayer = AudioPlayers.getInstance().getPlayer(interaction.guildId)

        if (cachedAudioPlayer == null) {
            const audioPlayer = new DiscordAudioPlayer(voiceConnection)
            AudioPlayers.getInstance().addPlayer(interaction.guildId, audioPlayer)
            audioPlayer.play(audioResource)
        } else {
            cachedAudioPlayer.update(voiceConnection)
            cachedAudioPlayer.play(audioResource)
        }

        await interaction.reply(Messages.getAndReplace(preferences, MessageType.PLAY_COMMAND_SUCCESS_RESPONSE, audioProviderResponse.name))
    }

    private getUrl(interaction: ChatInputCommandInteraction): string | undefined {
        return String(interaction.options.data.find(option => option.name == 'url')?.value)
    }
}

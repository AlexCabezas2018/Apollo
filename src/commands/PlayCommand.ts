import {ChatInputCommandInteraction, Client, MessageFlagsBitField} from "discord.js";
import {createAudioResource, getVoiceConnection, joinVoiceChannel} from "@discordjs/voice";

import Command from "./Command";
import DiscordAudioPlayer from "../audioplayer/DiscordAudioPlayer";
import AudioPlayers from "../audioplayer/AudioPlayers";
import {AudioProviderResponseStatus, YoutubeAudioProvider} from "../provider/YoutubeAudioProvider";

export default class PlayCommand extends Command {

    async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guild || interaction.guildId == null || !interaction.member) {
            await interaction.reply("Unexpected problem. Talk to a bot admin.")
            return;
        }

        // @ts-ignore
        const channel = interaction.member.voice.channel;

        if (!channel) {
            await interaction.reply({
                content: "You must be in a voice channel to call me!",
                flags: MessageFlagsBitField.Flags.Ephemeral
            })
            return;
        }

        let voiceConnection = getVoiceConnection(interaction.guildId)

        if (voiceConnection && voiceConnection.joinConfig.channelId != channel.id) {
            await interaction.reply({
                content: "I'm already in another channel. Please wait until it's not used.",
                flags: MessageFlagsBitField.Flags.Ephemeral
            })
            return;
        }

        const url = this.getUrl(interaction)
        if (!url) {
            await interaction.reply({
                content: "No url provided. Please try again.",
                flags: MessageFlagsBitField.Flags.Ephemeral
            })
            return;
        }

        const audioProviderResponse = await YoutubeAudioProvider.getAudio(url)
        if (audioProviderResponse.status != AudioProviderResponseStatus.SUCCESS) {
            await interaction.reply({
                content: "Error while getting audio resource. Please try again.",
                flags: MessageFlagsBitField.Flags.Ephemeral
            })
            return;
        }

        voiceConnection = voiceConnection || joinVoiceChannel({
            channelId: channel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild?.voiceAdapterCreator
        })

        const audioResource = createAudioResource(audioProviderResponse.audioData);

        const cachedAudioPlayer = AudioPlayers.getInstance().getPlayer(interaction.guildId)

        if (!cachedAudioPlayer) {
            const audioPlayer = new DiscordAudioPlayer(voiceConnection);
            AudioPlayers.getInstance().addPlayer(interaction.guildId, audioPlayer);
            audioPlayer.play(audioResource);
        } else {
            cachedAudioPlayer.update(voiceConnection);
            cachedAudioPlayer.play(audioResource);
        }

        await interaction.reply(`Playing ${audioProviderResponse.name}!!`)
    }

    private getUrl(interaction: ChatInputCommandInteraction): string | undefined {
        return String(interaction.options.data.find(option => option.name == "url")?.value)
    }
}
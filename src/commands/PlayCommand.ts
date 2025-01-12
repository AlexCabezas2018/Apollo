import {ChatInputCommandInteraction, Client, MessageFlagsBitField} from "discord.js";
import {createAudioResource, getVoiceConnection, joinVoiceChannel} from "@discordjs/voice";

import Command from "./Command";
import {Config} from "../../config"
import SimpleAudioPlayer from "../audioplayer/SimpleAudioPlayer";

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

        voiceConnection = voiceConnection || joinVoiceChannel({
            channelId: channel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild?.voiceAdapterCreator
        })

        const audioResource = createAudioResource(Config.sampleAudioPath)

        const simpleAudioPlayer = new SimpleAudioPlayer(
            voiceConnection,
            audioResource
        );

        simpleAudioPlayer.play()

        await interaction.reply("I'm playing a sample!")
    }
}
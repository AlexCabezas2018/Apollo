import {ChatInputCommandInteraction, Client, MessageFlagsBitField} from "discord.js";
import Command from "./Command";

import {createAudioResource, joinVoiceChannel} from "@discordjs/voice";
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

        const voiceConnection = joinVoiceChannel({
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
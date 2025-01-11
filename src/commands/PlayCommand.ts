import {ChatInputCommandInteraction} from "discord.js";
import Command from "./Command";

import {joinVoiceChannel} from "@discordjs/voice";

export default class PlayCommand extends Command {

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guild || interaction.guildId == null || !interaction.member) {
            await interaction.reply("Unexpected problem. Talk to a bot admin.")
            return;
        }

        // @ts-ignore
        if (!interaction.member.voice.channel) {
            await interaction.reply("You must be in a voice channel to call me!")
            return;
        }

        const voiceConnection = joinVoiceChannel({
            // @ts-ignore
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild?.voiceAdapterCreator
        })

        // Just for testing purposes. It will leave in 10 seconds
        setTimeout(() => voiceConnection.disconnect(), 10000)

        const url = interaction.options.data[0].value
        await interaction.reply(`I'm playing ${url}`)
    }
}
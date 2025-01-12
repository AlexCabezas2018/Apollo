import {Client, CommandInteraction, MessageFlagsBitField} from "discord.js";
import Command from "./Command";
import AudioPlayers from "../audioplayer/AudioPlayers";
import {getVoiceConnection} from "@discordjs/voice";

export default class StopCommand extends Command {
    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        if (!interaction.guild || interaction.guildId == null || !interaction.member) {
            await interaction.reply("Unexpected problem. Talk to a bot admin.")
            return;
        }

        // @ts-ignore
        const channel = interaction.member.voice.channel;

        let voiceConnection = getVoiceConnection(interaction.guildId)

        if ((voiceConnection && voiceConnection.joinConfig.channelId != channel.id) || !channel) {
            await interaction.reply({
                content: "You can't stop me if you are not in a voice channel!",
                flags: MessageFlagsBitField.Flags.Ephemeral
            })
            return;
        }

        const audioPlayer = AudioPlayers.getInstance().getPlayer(interaction.guildId)
        if (!audioPlayer || !audioPlayer.stop()) {
            await interaction.reply({
                content: "Nothing to stop! Try /play [url]",
                flags: MessageFlagsBitField.Flags.Ephemeral
            })

            return;
        }

        await interaction.reply("See you next time!");
    }

}
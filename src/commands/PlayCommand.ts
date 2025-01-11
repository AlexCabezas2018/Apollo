import { CommandInteraction } from "discord.js";
import Command from "./Command";

export default class PlayCommand extends Command {

    async execute(interaction: CommandInteraction): Promise<void> {
        const url = interaction.options.data[0].value
        await interaction.reply(`I'm playing ${url}`)
    }
}
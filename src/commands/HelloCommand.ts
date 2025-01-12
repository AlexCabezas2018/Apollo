import {Client, CommandInteraction} from "discord.js";
import Command from "./Command";

export default class HelloCommand extends Command {
    async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        await interaction.reply("Hello world!");
    }
}
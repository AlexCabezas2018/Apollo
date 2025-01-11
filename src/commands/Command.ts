import {CommandInteraction} from "discord.js";

export default abstract class Command {
    abstract execute(interaction: CommandInteraction): void
}
import { Client, CommandInteraction } from 'discord.js'

export default abstract class Command {
    abstract execute(client: Client, interaction: CommandInteraction): void
}

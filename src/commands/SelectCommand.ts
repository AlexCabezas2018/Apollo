import Command, { CommandInput } from './Command'
import { MessageType } from "../utils/MessageTypes";
import { Publisher } from "../events/PubSub";
import { ChatInputCommandInteraction } from "discord.js";
import { GuildPreferences } from "../preferences/GuildPreferences";
import PlayCommand from "./PlayCommand";

const playCommand = new PlayCommand();

export default class SelectCommand extends Command {
    async run(input: CommandInput): Promise<void> {
        const { interactionGuild, interaction } = input;

        const preferences = GuildPreferences.getInstance().getPreferences(interactionGuild.id);
        if (preferences.searchResults.length == 0) {
            Publisher.publishEvent(MessageType.SELECT_COMMAND_NO_SEARCH, { interaction });

            return;
        }

        const option = this.getOption(interaction);
        const searchResult = preferences.searchResults.at(option - 1);

        if (!searchResult || option - 1 < 0) {
            Publisher.publishEvent(MessageType.SELECT_COMMAND_OPTION_OUT_OF_RANGE, { interaction, metaData: preferences.searchResults.length });
            return;
        }

        preferences.searchResults = []
        GuildPreferences.getInstance().updatePreferences(interactionGuild.id, preferences);

        await playCommand.play(searchResult.url, input);

        Publisher.publishEvent(MessageType.SELECT_COMMAND_SUCCESS_RESPONSE, { interaction });
    }

    private getOption(interaction: ChatInputCommandInteraction): number {
        const option = interaction.options.data
            .find(option => option.name == 'number')

        if (!option) {
            return undefined;
        }

        return Number(option.value);
    }
}
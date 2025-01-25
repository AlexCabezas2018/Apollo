import { ChatInputCommandInteraction } from 'discord.js'
import Command, { CommandInput } from './Command'
import { GuildPreferences, SupportedLanguages } from "../preferences/GuildPreferences";
import { MessageType } from '../utils/MessageTypes';
import { Publisher } from "../events/PubSub";

export default class ChangeLanguageCommand extends Command {
    async run(input: CommandInput): Promise<void> {
        const { interaction, guildPreferences, interactionGuild } = input;

        guildPreferences.language = this.getSelectedLanguage(interaction);
        GuildPreferences.getInstance().updatePreferences(interactionGuild.id, guildPreferences);

        Publisher.publishEvent(MessageType.CHANGE_LANGUAGE_COMMAND_SUCCESS_RESPONSE, { interaction });
    }

    private getSelectedLanguage(interaction: ChatInputCommandInteraction): SupportedLanguages {
        const rawSelectedValue = String(interaction.options.data.find(option => option.name == 'language')?.value);
        return rawSelectedValue as SupportedLanguages;
    }
}

import { ChatInputCommandInteraction, MessageFlagsBitField } from 'discord.js'
import Command, { CommandInput } from './Command'
import { Messages } from "../utils/Messages";
import { GuildPreferences, SupportedLanguages } from "../preferences/GuildPreferences";
import { MessageType } from '../utils/MessageTypes';

export default class ChangeLanguageCommand extends Command {
    async run(input: CommandInput): Promise<void> {
        const { interaction, guildPreferences, interactionGuild } = input;

        guildPreferences.language = this.getSelectedLanguage(interaction);
        GuildPreferences.getInstance().updatePreferences(interactionGuild.id, guildPreferences);

        await interaction.reply({
            content: Messages.get(guildPreferences, MessageType.CHANGE_LANGUAGE_COMMAND_SUCCESS_RESPONSE),
            flags: MessageFlagsBitField.Flags.Ephemeral
        });
    }

    private getSelectedLanguage(interaction: ChatInputCommandInteraction): SupportedLanguages {
        const rawSelectedValue = String(interaction.options.data.find(option => option.name == 'language')?.value);
        return rawSelectedValue as SupportedLanguages;
    }
}

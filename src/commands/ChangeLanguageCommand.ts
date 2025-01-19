import { ChatInputCommandInteraction, Client, MessageFlagsBitField } from 'discord.js'
import Command from './Command'
import { getVoiceConnection } from '@discordjs/voice'
import { Messages, MessageType } from "../utils/Messages";
import { GuildPreferences, SupportedLanguages } from "../preferences/GuildPreferences";

export default class ChangeLanguageCommand extends Command {
    async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<void> {
        const preferences = GuildPreferences.getInstance().getPreferences(interaction.guildId)

        if ((interaction.guild == null) || interaction.guildId == null || (interaction.member == null)) {
            await interaction.reply(Messages.get(preferences, MessageType.UNEXPECTED_ERROR))
            return
        }

        // @ts-expect-error
        const channel = interaction.member.voice.channel

        const voiceConnection = getVoiceConnection(interaction.guildId)

        if (((voiceConnection != null) && voiceConnection.joinConfig.channelId != channel.id) || !channel) {
            await interaction.reply({
                content: Messages.get(preferences, MessageType.USER_NOT_IN_VOICE_CHANNEL),
                flags: MessageFlagsBitField.Flags.Ephemeral
            })
            return
        }

        const language = this.getSelectedLanguage(interaction);

        const selectedPreferences = GuildPreferences.getInstance().getPreferences(interaction.guildId);
        selectedPreferences.language = language;

        GuildPreferences.getInstance().updatePreferences(interaction.guildId, preferences);

        await interaction.reply(Messages.get(selectedPreferences, MessageType.CHANGE_LANGUAGE_COMMAND_SUCCESS_RESPONSE));
    }

    private getSelectedLanguage(interaction: ChatInputCommandInteraction): SupportedLanguages {
        const rawSelectedValue = String(interaction.options.data.find(option => option.name == 'language')?.value);
        return rawSelectedValue as SupportedLanguages;
    }
}

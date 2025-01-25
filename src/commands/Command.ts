import { ChatInputCommandInteraction, Client, Guild, MessageFlagsBitField } from 'discord.js'
import { GuildPreferences, Preferences } from "../preferences/GuildPreferences";
import { Messages, MessageType } from "../utils/Messages";
import { getVoiceConnection, VoiceConnection } from "@discordjs/voice";

export interface CommandInput {
    interaction: ChatInputCommandInteraction;
    guildPreferences: Preferences;
    channelId: string;
    voiceConnection?: VoiceConnection;
    interactionGuild: Guild;
}

export default abstract class Command {
    async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<void> {
        const preferences = GuildPreferences.getInstance().getPreferences(interaction.guildId)

        if ((interaction.guild == null) || interaction.guildId == null || (interaction.member == null)) {
            await interaction.reply(Messages.get(preferences, MessageType.UNEXPECTED_ERROR));
            return;
        }

        // @ts-expect-error
        const channel = interaction.member.voice.channel;

        let voiceConnection = getVoiceConnection(interaction.guildId);

        if (!channel || ((voiceConnection != null) && voiceConnection.joinConfig.channelId != channel.id)) {
            await interaction.reply({
                content: Messages.get(preferences, MessageType.USER_NOT_IN_VOICE_CHANNEL),
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
            return;
        }

        await this.run({
            interaction: interaction,
            guildPreferences: preferences,
            channelId: channel.id,
            voiceConnection: voiceConnection,
            interactionGuild: interaction.guild
        });
    }

    abstract run(commandInput: CommandInput): Promise<void>
}

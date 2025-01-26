import Listener from "./Listener";
import { MessageType } from "../utils/MessageTypes";
import { Messages } from "../utils/Messages";
import { MessageContent } from "./PubSub";
import { GuildPreferences } from "../preferences/GuildPreferences";
import { MessageFlagsBitField } from "discord.js";
import { Logger } from "../utils/Logger";

export default class PlayCommandListener extends Listener {
    setup(): void {
        this.eventEmitter.on(MessageType.PLAY_COMMAND_SUCCESS_RESPONSE, async (content: MessageContent) => {
            const { interaction } = content;
            const preferences = GuildPreferences.getInstance().getPreferences(interaction.guildId);

            const message = Messages.getAndReplace(
                preferences,
                MessageType.PLAY_COMMAND_SUCCESS_RESPONSE,
                content.metaData.title
            );

            if (interaction.replied) {
                await interaction.followUp(message)
            } else {
                await interaction.reply(message);
            }
        });

        this.eventEmitter.on(MessageType.PLAY_COMMAND_ADDED_TO_QUEUE_SUCCESS, async (content: MessageContent) => {
            const { interaction } = content;
            const preferences = GuildPreferences.getInstance().getPreferences(interaction.guildId);

            await interaction.reply(
                Messages.getAndReplace(
                    preferences,
                    MessageType.PLAY_COMMAND_ADDED_TO_QUEUE_SUCCESS,
                    content.metaData.title
                )
            );
        });

        this.eventEmitter.on(MessageType.PLAY_COMMAND_SEARCH_BY_TERM_SUCCESS, async (content: MessageContent) => {
            const { interaction } = content;
            const preferences = GuildPreferences.getInstance().getPreferences(interaction.guildId);

            await interaction.reply(
                {
                    content: Messages.getAndReplace(
                        preferences,
                        MessageType.PLAY_COMMAND_SEARCH_BY_TERM_SUCCESS,
                        content.metaData
                    ),
                    flags: MessageFlagsBitField.Flags.Ephemeral
                }
            );
        });

        this.eventEmitter.on(MessageType.PLAY_COMMAND_WRONG_URL, async (content: MessageContent) => {
            const { interaction } = content;
            const preferences = GuildPreferences.getInstance().getPreferences(interaction.guildId);

            await interaction.reply({
                content: Messages.get(preferences, MessageType.PLAY_COMMAND_WRONG_URL),
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
        })

        this.eventEmitter.on(MessageType.PLAY_COMMAND_RESOURCE_ERROR, async (content: MessageContent) => {
            const { interaction } = content;
            const preferences = GuildPreferences.getInstance().getPreferences(interaction.guildId);

            await interaction.reply({
                content: Messages.get(preferences, MessageType.PLAY_COMMAND_RESOURCE_ERROR),
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
        });

        Logger.debug("PlayCommand listener ON.");
    }
}
import { MessageType } from "../utils/MessageTypes";
import Listener from "./Listener";
import { GuildPreferences } from "../preferences/GuildPreferences";
import { Messages } from "../utils/Messages";
import { MessageFlagsBitField } from "discord.js";
import { MessageContent } from "./PubSub";
import { Logger } from "../utils/Logger";

export default class NextCommandListener extends Listener {
    setup(): void {
        this.eventEmitter.on(MessageType.NEXT_COMMAND_NO_PLAYER, async (content: MessageContent) => {
            const { interaction } = content;
            const preferences = GuildPreferences.getInstance().getPreferences(interaction.guildId);

            await interaction.reply({
                content: Messages.get(preferences, MessageType.NEXT_COMMAND_NO_PLAYER),
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
        });

        this.eventEmitter.on(MessageType.NEXT_COMMAND_NO_SONGS_IN_QUEUE, async (content: MessageContent) => {
            const { interaction } = content;
            const preferences = GuildPreferences.getInstance().getPreferences(interaction.guildId);

            await interaction.reply({
                content: Messages.get(preferences, MessageType.NEXT_COMMAND_NO_SONGS_IN_QUEUE),
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
        });

        Logger.debug("NextCommand listener ON.");
    }
}
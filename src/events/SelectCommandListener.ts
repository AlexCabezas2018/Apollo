import { MessageType } from "../utils/MessageTypes";
import Listener from "./Listener";
import { GuildPreferences } from "../preferences/GuildPreferences";
import { Messages } from "../utils/Messages";
import { MessageFlagsBitField } from "discord.js";
import { MessageContent } from "./PubSub";
import { Logger } from "../utils/Logger";

export default class SelectCommandListener extends Listener {
    setup(): void {
        this.eventEmitter.on(MessageType.SELECT_COMMAND_NO_SEARCH, async (content: MessageContent) => {
            const { interaction } = content;
            const preferences = GuildPreferences.getInstance().getPreferences(interaction.guildId);

            await interaction.reply({
                content: Messages.get(preferences, MessageType.SELECT_COMMAND_NO_SEARCH),
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
        });

        this.eventEmitter.on(MessageType.SELECT_COMMAND_OPTION_OUT_OF_RANGE, async (content: MessageContent) => {
            const { interaction } = content;
            const preferences = GuildPreferences.getInstance().getPreferences(interaction.guildId);

            await interaction.reply({
                content: Messages.getAndReplace(preferences, MessageType.SELECT_COMMAND_OPTION_OUT_OF_RANGE, content.metaData),
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
        });

        Logger.debug("SelectCommand listener ON.");
    }
}
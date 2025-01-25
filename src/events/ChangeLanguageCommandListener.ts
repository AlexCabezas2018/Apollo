import { MessageType } from "../utils/MessageTypes";
import Listener from "./Listener";
import { GuildPreferences } from "../preferences/GuildPreferences";
import { Messages } from "../utils/Messages";
import { MessageFlagsBitField } from "discord.js";
import { MessageContent } from "./PubSub";
import { Logger } from "../utils/Logger";

export default class ChangeLanguageCommandListener extends Listener {
    setup(): void {
        this.eventEmitter.on(MessageType.CHANGE_LANGUAGE_COMMAND_SUCCESS_RESPONSE, async (content: MessageContent) => {
            const { interaction } = content;
            const preferences = GuildPreferences.getInstance().getPreferences(interaction.guildId);

            await interaction.reply({
                content: Messages.get(preferences, MessageType.CHANGE_LANGUAGE_COMMAND_SUCCESS_RESPONSE),
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
        });

        Logger.debug("ChangeLanguageCommand listener ON.");
    }
}
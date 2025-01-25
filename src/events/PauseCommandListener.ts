import { MessageType } from "../utils/MessageTypes";
import Listener from "./Listener";
import { GuildPreferences } from "../preferences/GuildPreferences";
import { Messages } from "../utils/Messages";
import { MessageFlagsBitField } from "discord.js";
import { MessageContent } from "./PubSub";
import { Logger } from "../utils/Logger";

export default class PauseCommandListener extends Listener {
    setup(): void {
        this.eventEmitter.on(MessageType.PAUSE_COMMAND_NOTHING_TO_PAUSE, async (content: MessageContent) => {
            const { interaction } = content;
            const preferences = GuildPreferences.getInstance().getPreferences(interaction.guildId);

            await interaction.reply({
                content: Messages.get(preferences, MessageType.PAUSE_COMMAND_NOTHING_TO_PAUSE),
                flags: MessageFlagsBitField.Flags.Ephemeral
            })
        });

        this.eventEmitter.on(MessageType.PAUSE_COMMAND_SUCCESS_RESPONSE, async (content: MessageContent) => {
            const { interaction } = content;
            const preferences = GuildPreferences.getInstance().getPreferences(interaction.guildId);

            await interaction.reply(Messages.get(preferences, MessageType.PAUSE_COMMAND_SUCCESS_RESPONSE));
        });

        Logger.debug("PauseCommand listener ON.");
    }
}
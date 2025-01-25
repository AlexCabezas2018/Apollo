import Listener from "./Listener";
import { MessageType } from "../utils/MessageTypes";
import { MessageContent } from "./PubSub";
import { Messages } from "../utils/Messages";
import { MessageFlagsBitField } from "discord.js";
import { GuildPreferences } from "../preferences/GuildPreferences";
import { Logger } from "../utils/Logger";

export default class StopCommandListener extends Listener {
    setup(): void {
        this.eventEmitter.on(MessageType.STOP_COMMAND_NOTHING_TO_STOP, async (content: MessageContent) => {
            const { interaction } = content;
            const preferences = GuildPreferences.getInstance().getPreferences(interaction.guildId);

            await interaction.reply({
                content: Messages.get(preferences, MessageType.STOP_COMMAND_NOTHING_TO_STOP),
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
        });

        this.eventEmitter.on(MessageType.STOP_COMMAND_SUCCESS_RESPONSE, async (content: MessageContent) => {
            const { interaction } = content;
            const preferences = GuildPreferences.getInstance().getPreferences(interaction.guildId);

            await interaction.reply(Messages.get(preferences, MessageType.STOP_COMMAND_SUCCESS_RESPONSE))
        });

        Logger.debug("StopCommand listener ON.");
    }
}
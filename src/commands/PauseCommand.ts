import Command, { CommandInput } from './Command'
import AudioPlayers from '../audioplayer/AudioPlayers'
import { MessageType } from "../utils/MessageTypes";
import { Publisher } from "../events/PubSub";

export default class PauseCommand extends Command {
    async run(input: CommandInput): Promise<void> {
        const { interaction, interactionGuild } = input;

        const audioPlayer = AudioPlayers.getInstance().getPlayer(interactionGuild.id)
        if ((audioPlayer == null) || !audioPlayer.pause()) {
            Publisher.publishEvent(MessageType.PAUSE_COMMAND_NOTHING_TO_PAUSE, { interaction });

            return
        }

        Publisher.publishEvent(MessageType.PAUSE_COMMAND_SUCCESS_RESPONSE, { interaction });
    }
}

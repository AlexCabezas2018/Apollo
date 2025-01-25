import Command, { CommandInput } from './Command'
import AudioPlayers from '../audioplayer/AudioPlayers'
import { MessageType } from "../utils/MessageTypes";
import { Publisher } from "../events/PubSub";

export default class QueueCommand extends Command {
    async run(input: CommandInput): Promise<void> {
        const { interactionGuild, interaction } = input;
        const player = AudioPlayers.getInstance().getPlayer(interactionGuild.id);
        if (!player) {
            Publisher.publishEvent(MessageType.QUEUE_COMMAND_NO_QUEUE_RESPONSE, { interaction });
            return;
        }

        const queueList = player.songs.toPrettyString();
        if (!queueList) {
            Publisher.publishEvent(MessageType.QUEUE_COMMAND_NO_QUEUE_RESPONSE, { interaction });
            return;
        }

        Publisher.publishEvent(MessageType.QUEUE_COMMAND_SUCCESS_RESPONSE, { interaction, metaData: queueList });
    }
}
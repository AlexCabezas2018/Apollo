import Command, { CommandInput } from './Command'
import AudioPlayers from '../audioplayer/AudioPlayers'
import { AudioData } from "../provider/AudioProvider";
import { MessageType } from "../utils/MessageTypes";
import {Publisher} from "../events/PubSub";

export default class QueueCommand extends Command {
    async run(input: CommandInput): Promise<void> {
        const { interactionGuild, interaction } = input;
        const player = AudioPlayers.getInstance().getPlayer(interactionGuild.id);
        if (!player) {
            Publisher.publishEvent(MessageType.QUEUE_COMMAND_NO_QUEUE_RESPONSE, {interaction});
            return;
        }

        const queueList = this.queueToString(player.queue);
        if (!queueList) {
            Publisher.publishEvent(MessageType.QUEUE_COMMAND_NO_QUEUE_RESPONSE, {interaction});
            return;
        }

        Publisher.publishEvent(MessageType.QUEUE_COMMAND_SUCCESS_RESPONSE, {interaction, metaData: queueList});
    }

    private queueToString(queue: AudioData[]): string | undefined {
        if (queue.length == 0) return undefined;

        return queue.reduce((acc, song, currentIndex) => {
            if (currentIndex == 0) {
                return acc + `${currentIndex + 1} (next) - ${song.title}\n`
            }
            return acc + `${currentIndex + 1} - ${song.title}\n`;
        }, "");
    }
}
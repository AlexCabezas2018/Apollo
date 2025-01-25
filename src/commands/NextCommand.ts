import Command, { CommandInput } from './Command'
import AudioPlayers from '../audioplayer/AudioPlayers'
import { MessageType } from "../utils/MessageTypes";
import { Publisher } from "../events/PubSub";

export default class NextCommand extends Command {
    async run(input: CommandInput): Promise<void> {
        const { interaction, interactionGuild } = input;

        const audioPlayer = AudioPlayers.getInstance().getPlayer(interactionGuild.id)
        if (!audioPlayer) {
            Publisher.publishEvent(MessageType.NEXT_COMMAND_NO_PLAYER, { interaction });
            return;
        }

        if (audioPlayer.queue.length == 0) {
            Publisher.publishEvent(MessageType.NEXT_COMMAND_NO_SONGS_IN_QUEUE, { interaction });
            audioPlayer.stop();
            return;
        }

        await audioPlayer.play(interaction);
    }
}

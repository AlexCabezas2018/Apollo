import Command, { CommandInput } from './Command'
import AudioPlayers from '../audioplayer/AudioPlayers'
import { MessageType } from "../utils/MessageTypes";
import { Publisher } from "../events/PubSub";

export default class ResumeCommand extends Command {
    async run(input: CommandInput): Promise<void> {
        const { interaction, interactionGuild } = input;

        const audioPlayer = AudioPlayers.getInstance().getPlayer(interactionGuild.id);
        if ((audioPlayer == null) || !audioPlayer.resume()) {
            Publisher.publishEvent(MessageType.RESUME_COMMAND_NOTHING_TO_RESUME, { interaction });
            return;
        }

        Publisher.publishEvent(MessageType.RESUME_COMMAND_SUCCESS_RESPONSE, { interaction });
    }
}

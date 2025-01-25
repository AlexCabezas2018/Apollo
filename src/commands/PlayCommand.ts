import { CommandInteraction } from 'discord.js'
import { joinVoiceChannel } from '@discordjs/voice'

import Command, { CommandInput } from './Command'
import DiscordAudioPlayer from '../audioplayer/DiscordAudioPlayer'
import AudioPlayers from '../audioplayer/AudioPlayers'
import { AudioProviderFactory } from "../provider/AudioProviderFactory";
import { Publisher } from "../events/PubSub";
import { MessageType } from '../utils/MessageTypes'
import { AudioProviderResponseStatus } from "../provider/AudioData";

export default class PlayCommand extends Command {
    async run(input: CommandInput): Promise<void> {
        const { interaction, channelId, interactionGuild } = input

        const url = this.getUrl(interaction)
        const audioProvider = AudioProviderFactory.getProvider(url);
        if (!audioProvider) {
            Publisher.publishEvent(MessageType.PLAY_COMMAND_WRONG_URL, { interaction });
            return;
        }

        const audioProviderResponse = await audioProvider.get(url);
        if (audioProviderResponse.status != AudioProviderResponseStatus.SUCCESS) {
            Publisher.publishEvent(MessageType.PLAY_COMMAND_RESOURCE_ERROR, { interaction });
            return;
        }

        const cachedAudioPlayer = AudioPlayers.getInstance().getPlayer(interactionGuild.id);

        if (cachedAudioPlayer == null) {
            const voiceConnection = joinVoiceChannel({
                channelId: channelId,
                guildId: interactionGuild.id,
                adapterCreator: interactionGuild.voiceAdapterCreator
            });

            const audioPlayer = new DiscordAudioPlayer(interaction, voiceConnection);
            audioPlayer.addToQueue(audioProviderResponse);
            AudioPlayers.getInstance().addPlayer(interactionGuild.id, audioPlayer);
            await audioPlayer.play();
        } else {
            cachedAudioPlayer.addToQueue(audioProviderResponse);
            Publisher.publishEvent(MessageType.PLAY_COMMAND_ADDED_TO_QUEUE_SUCCESS, {
                interaction, metaData: audioProviderResponse
            });
        }
    }

    private getUrl(interaction: CommandInteraction): string {
        return String(
            interaction.options.data
                .find(option => option.name == 'url')?.value
        ) || "n/a";
    }
}

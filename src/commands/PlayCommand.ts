import { CommandInteraction } from 'discord.js'
import { joinVoiceChannel } from '@discordjs/voice'

import Command, { CommandInput } from './Command'
import DiscordAudioPlayer from '../audioplayer/DiscordAudioPlayer'
import AudioPlayers from '../audioplayer/AudioPlayers'
import { AudioProviderFactory } from "../provider/AudioProviderFactory";
import { Publisher } from "../events/PubSub";
import { MessageType } from '../utils/MessageTypes'
import { AudioProviderResponseStatus } from "../provider/AudioData";
import { SearchInput } from "../seachprovider/SearchInput";
import { SearchProviderDelegator } from "../seachprovider/SearchProvider";

export default class PlayCommand extends Command {
    async run(input: CommandInput): Promise<void> {
        const { interaction } = input

        const url = this.getUrl(interaction)
        if (!url) {
            const searchInput = this.getSearchOptions(interaction);
            const results = await SearchProviderDelegator.search(searchInput);
            Publisher.publishEvent(MessageType.PLAY_COMMAND_SEARCH_BY_TERM_SUCCESS, { interaction, metaData: results });
            return;
        }

        await this.play(url, input);
    }

    async play(url: string, input: CommandInput): Promise<void> {
        const { interaction, channelId, interactionGuild } = input

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
        const urlOption = interaction.options.data
            .find(option => option.name == 'url')

        if (!urlOption) {
            return undefined;
        }

        return String(urlOption.options.find(option => option.name == "term")?.value)
    }

    private getSearchOptions(interaction: CommandInteraction): SearchInput {
        const searchOptions = interaction.options.data
            .find(option => option.name == 'search')

        const searchProviderOptions = searchOptions.options[0]
        const term = String(searchProviderOptions.options.find(option => option.name == 'term').value);

        return {
            term: term,
            provider: searchProviderOptions.name,
            guildId: interaction.guildId
        }
    }
}

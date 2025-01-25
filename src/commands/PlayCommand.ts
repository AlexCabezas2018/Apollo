import { CommandInteraction, MessageFlagsBitField } from 'discord.js'
import { joinVoiceChannel } from '@discordjs/voice'

import Command, { CommandInput } from './Command'
import DiscordAudioPlayer from '../audioplayer/DiscordAudioPlayer'
import AudioPlayers from '../audioplayer/AudioPlayers'
import { Messages, MessageType } from "../utils/Messages";
import { AudioProviderResponseStatus } from "../provider/AudioProvider";
import { AudioProviderFactory } from "../provider/AudioProviderFactory";

export default class PlayCommand extends Command {
    async run(input: CommandInput): Promise<void> {
        const { interaction, guildPreferences, channelId, interactionGuild } = input

        const url = this.getUrl(interaction)
        const audioProvider = AudioProviderFactory.getProvider(url);
        if (!audioProvider) {
            await interaction.reply({
                content: Messages.get(guildPreferences, MessageType.PLAY_COMMAND_WRONG_URL),
                flags: MessageFlagsBitField.Flags.Ephemeral
            })
            return;
        }

        const audioProviderResponse = await audioProvider.get(url);
        if (audioProviderResponse.status != AudioProviderResponseStatus.SUCCESS) {
            await interaction.reply({
                content: Messages.get(guildPreferences, MessageType.PLAY_COMMAND_RESOURCE_ERROR),
                flags: MessageFlagsBitField.Flags.Ephemeral
            })
            return;
        }

        const cachedAudioPlayer = AudioPlayers.getInstance().getPlayer(interactionGuild.id);

        if (cachedAudioPlayer == null) {
            const voiceConnection = joinVoiceChannel({
                channelId: channelId,
                guildId: interactionGuild.id,
                adapterCreator: interactionGuild.voiceAdapterCreator
            });

            const audioPlayer = new DiscordAudioPlayer(interaction, voiceConnection, guildPreferences);
            audioPlayer.addToQueue(audioProviderResponse);
            AudioPlayers.getInstance().addPlayer(interactionGuild.id, audioPlayer);
            await audioPlayer.play();
        } else {
            cachedAudioPlayer.addToQueue(audioProviderResponse);
            await interaction.reply(
                Messages.getAndReplace(
                    guildPreferences,
                    MessageType.PLAY_COMMAND_ADDED_TO_QUEUE_SUCCESS,
                    audioProviderResponse.title
                )
            );
        }
    }

    private getUrl(interaction: CommandInteraction): string {
        return String(
            interaction.options.data
                .find(option => option.name == 'url')?.value
        ) || "n/a";
    }
}

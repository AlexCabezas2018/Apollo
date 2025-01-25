import {
    AudioPlayer,
    AudioPlayerStatus,
    createAudioPlayer, createAudioResource,
    VoiceConnection,
    VoiceConnectionStatus
} from '@discordjs/voice'
import { Logger } from '../utils/Logger'
import { AudioData } from "../provider/AudioProvider";
import AudioPlayers from "./AudioPlayers";
import { ChatInputCommandInteraction } from 'discord.js';
import { MessageType } from "../utils/MessageTypes";
import { Publisher } from "../events/PubSub";

export default class DiscordAudioPlayer {
    private voiceConnection: VoiceConnection;
    private readonly audioPlayer: AudioPlayer;
    private songsQueue: AudioData[];
    private interaction: ChatInputCommandInteraction;


    constructor(interaction: ChatInputCommandInteraction, voiceConnection: VoiceConnection) {
        this.voiceConnection = voiceConnection;
        this.audioPlayer = createAudioPlayer();
        this.interaction = interaction;
        this.songsQueue = [];

        this.setup();
    }

    get queue(): AudioData[] {
        return this.songsQueue;
    }

    async play(interaction: ChatInputCommandInteraction = this.interaction): Promise<void> {
        const audioData = this.songsQueue.shift();
        const audioResource = createAudioResource(audioData.audioResource)
        this.audioPlayer.play(audioResource);

        Publisher.publishEvent(MessageType.PLAY_COMMAND_SUCCESS_RESPONSE, {
            interaction, metaData: audioData
        });
    }

    addToQueue(audioData: AudioData): void {
        this.songsQueue.push(audioData);
        Logger.debug(`Current song queue size: ${this.songsQueue.length}`);
    }

    stop(): boolean {
        if (this.audioPlayer.state.status == AudioPlayerStatus.Idle) return false;
        this.songsQueue = [];
        this.audioPlayer.stop(true);
        return true;
    }

    pause(): boolean {
        if ([AudioPlayerStatus.Idle, AudioPlayerStatus.Paused]
            .includes(this.audioPlayer.state.status)) return false;
        this.audioPlayer.pause(true);
        return true;
    }

    resume(): boolean {
        if (this.audioPlayer.state.status != AudioPlayerStatus.Paused) return false;
        this.audioPlayer.unpause();
        return true;
    }

    private setup(): void {
        this.voiceConnection.on(VoiceConnectionStatus.Disconnected, () => {
            this.voiceConnection.destroy();
            AudioPlayers.getInstance().removePlayer(this.voiceConnection.joinConfig.guildId);
        });

        this.audioPlayer.on('error', error => {
            Logger.error(error);
            this.voiceConnection.destroy();
            AudioPlayers.getInstance().removePlayer(this.voiceConnection.joinConfig.guildId);
        });

        const subscription = this.voiceConnection.subscribe(this.audioPlayer);

        this.audioPlayer.on(AudioPlayerStatus.Idle, async () => {
            if (this.songsQueue.length > 0) {
                Logger.debug('Player has more songs. Playing next.');
                await this.play();
                return;
            }

            Logger.debug('Playing has no more music. Disconnecting');
            if (this.voiceConnection.state.status != VoiceConnectionStatus.Destroyed) this.voiceConnection.destroy();
            if (subscription != null) subscription.unsubscribe();
            AudioPlayers.getInstance().removePlayer(this.voiceConnection.joinConfig.guildId);
        });

        this.audioPlayer.on(AudioPlayerStatus.Playing, () => {
            Logger.debug('Player is playing music.');
        });

        this.audioPlayer.on(AudioPlayerStatus.Paused, () => {
            Logger.debug('Player has paused.');
        });
    }
}

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
import { Messages, MessageType } from "../utils/Messages";
import { Preferences } from "../preferences/GuildPreferences";

export default class DiscordAudioPlayer {
    private voiceConnection: VoiceConnection;
    private readonly audioPlayer: AudioPlayer;
    private songsQueue: AudioData[];
    private interaction: ChatInputCommandInteraction;
    private readonly preferences: Preferences;


    constructor(interaction: ChatInputCommandInteraction, voiceConnection: VoiceConnection, preferences: Preferences) {
        this.voiceConnection = voiceConnection;
        this.audioPlayer = createAudioPlayer();
        this.interaction = interaction;
        this.songsQueue = [];
        this.preferences = preferences;

        this.setup();
    }

    async play(): Promise<void> {
        const audioData = this.songsQueue.shift();
        const audioResource = createAudioResource(audioData.audioResource)
        this.audioPlayer.play(audioResource);
        const message = Messages.getAndReplace(
            this.preferences,
            MessageType.PLAY_COMMAND_SUCCESS_RESPONSE,
            audioData.title
        );

        if (this.interaction.replied) {
            await this.interaction.followUp(message)
        } else {
            await this.interaction.reply(message);
        }
    }

    addToQueue(audioData: AudioData): void {
        this.songsQueue.push(audioData);
        Logger.debug(`Current song queue size: ${this.songsQueue.length}`);
    }

    stop(): boolean {
        if (this.audioPlayer.state.status == AudioPlayerStatus.Idle) return false;
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
        });

        this.audioPlayer.on('error', error => {
            Logger.error(error);
            this.voiceConnection.destroy();
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

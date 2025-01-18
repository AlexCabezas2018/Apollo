import {
    AudioPlayer,
    AudioPlayerStatus,
    AudioResource,
    createAudioPlayer,
    VoiceConnection,
    VoiceConnectionStatus
} from "@discordjs/voice";
import {Logger} from "../utils/Logger";

export default class DiscordAudioPlayer {
    protected voiceConnection: VoiceConnection;
    protected audioPlayer: AudioPlayer;

    constructor(voiceConnection: VoiceConnection) {
        this.voiceConnection = voiceConnection;
        this.audioPlayer = createAudioPlayer();

        this.setup();
    }

    play(audioResource: AudioResource): void {
        this.audioPlayer.play(audioResource);
    }

    stop(): boolean {
        if (this.audioPlayer.state.status == AudioPlayerStatus.Idle) return false;
        this.audioPlayer.stop();
        return true;
    }

    update(voiceConnection: VoiceConnection): void {
        this.voiceConnection = voiceConnection;
        this.audioPlayer = createAudioPlayer();

        this.setup();
    }

    private setup(): void {
        this.voiceConnection.on(VoiceConnectionStatus.Disconnected, () => {
                this.voiceConnection.destroy();
            }
        );

        this.audioPlayer.on('error', error => {
            Logger.error(error);
            this.voiceConnection.destroy();
        });

        const subscription = this.voiceConnection.subscribe(this.audioPlayer);

        this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
            Logger.debug("Player has no more music to play. Disconnecting.")
            if (this.voiceConnection.state.status != VoiceConnectionStatus.Destroyed) this.voiceConnection.destroy();
            if (subscription) subscription.unsubscribe()
        })

        this.audioPlayer.on(AudioPlayerStatus.Playing, () => {
            Logger.debug("Player is playing music.")
        })
    }
}
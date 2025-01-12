import {AudioPlayer, AudioPlayerStatus, createAudioPlayer, VoiceConnection} from "@discordjs/voice";
import {Logger} from "../utils/logger";

export default abstract class DiscordAudioPlayer {
    protected voiceConnection: VoiceConnection;
    protected readonly audioPlayer: AudioPlayer;

    protected constructor(voiceConnection: VoiceConnection) {
        this.voiceConnection = voiceConnection;
        this.audioPlayer = createAudioPlayer();

        this.audioPlayer.on('error', error => {
            Logger.error(error);
            this.voiceConnection.disconnect();
        })

        const subscription = voiceConnection.subscribe(this.audioPlayer)

        this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
            Logger.debug("Player has no more music to play. Disconnecting.")
            voiceConnection.destroy();
            if (subscription) subscription.unsubscribe()
        })

        this.audioPlayer.on(AudioPlayerStatus.Playing, () => {
            Logger.debug("Player is playing music.")
        })
    }

    abstract play(): void;
}
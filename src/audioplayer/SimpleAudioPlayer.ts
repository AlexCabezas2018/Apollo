import {AudioResource, VoiceConnection} from "@discordjs/voice";
import DiscordAudioPlayer from "./DiscordAudioPlayer";

export default class SimpleAudioPlayer extends DiscordAudioPlayer {
    private readonly audioResource: AudioResource;

    constructor(voiceConnection: VoiceConnection, audioResource: AudioResource) {
        super(voiceConnection)
        this.audioResource = audioResource;
    }

    play(): void {
        this.audioPlayer.play(this.audioResource)
    }
}
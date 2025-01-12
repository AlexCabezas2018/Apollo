import DiscordAudioPlayer from "./DiscordAudioPlayer";

export default class AudioPlayers {
    private players: Map<string, DiscordAudioPlayer>;
    static instance: AudioPlayers

    constructor() {
        this.players = new Map();
    }

    static getInstance() {
        if(!this.instance) this.instance = new AudioPlayers();
        return this.instance;
    }

    getPlayer(guildId: string): DiscordAudioPlayer | undefined {
        return this.players.get(guildId);
    }

    addPlayer(guildId: string, audioPlayer: DiscordAudioPlayer) {
        this.players.set(guildId, audioPlayer);
    }
}
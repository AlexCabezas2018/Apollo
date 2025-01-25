import DiscordAudioPlayer from './DiscordAudioPlayer'

export default class AudioPlayers {
    static instance: AudioPlayers
    private readonly players: Map<string, DiscordAudioPlayer>

    constructor() {
        this.players = new Map()
    }

    static getInstance() {
        if (!this.instance) this.instance = new AudioPlayers()
        return this.instance
    }

    getPlayer(guildId: string): DiscordAudioPlayer | undefined {
        return this.players.get(guildId)
    }

    addPlayer(guildId: string, audioPlayer: DiscordAudioPlayer) {
        this.players.set(guildId, audioPlayer)
    }

    removePlayer(guildId: string): void {
        this.players.delete(guildId);
    }
}

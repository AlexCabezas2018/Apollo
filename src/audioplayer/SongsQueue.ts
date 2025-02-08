import { AudioData } from "../provider/AudioData";

export default class SongsQueue {
    private queue: AudioData[];

    constructor() {
        this.queue = [];
    }

    size() {
        return this.queue.length;
    }

    addSong(song: AudioData) {
        this.queue.push(song);
    }

    nextSong(): AudioData {
        return this.queue.shift();
    }

    clean() {
        this.queue = [];
    }

    isEmpty() {
        return this.queue.length === 0;
    }

    toPrettyString() {
        if (this.isEmpty()) return undefined;

        return this.queue.reduce((acc, song, currentIndex) => {
            if (currentIndex == 0) {
                return acc + `**${currentIndex + 1}** (next) - ${song.title}\n`
            }
            return acc + `${currentIndex + 1} - _${song.title}_\n`;
        }, "");
    }
}
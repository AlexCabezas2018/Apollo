import events from 'events'

export default abstract class Listener {
    protected eventEmitter: events.EventEmitter;

    constructor(eventEmitter: events.EventEmitter) {
        this.eventEmitter = eventEmitter;
    }

    abstract setup(): void
}
import events from 'events'
import PlayCommandListener from "./PlayCommandListener";
import { MessageType } from "../utils/MessageTypes";
import { ChatInputCommandInteraction } from "discord.js";

const eventEmitter = new events.EventEmitter();

const LISTENERS = [
    new PlayCommandListener(eventEmitter)
];

export interface MessageContent {
    interaction: ChatInputCommandInteraction,
    metaData?: any
}

export const PubSub = {
    init: (onDone: Function) => {
        LISTENERS.forEach((listener) => listener.setup());
        onDone();
    }
}

export const Publisher = {
    publishEvent: (messageType: MessageType, content: MessageContent) => {
        eventEmitter.emit(messageType, content);
    }
}
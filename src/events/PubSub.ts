import events from 'events'
import PlayCommandListener from "./PlayCommandListener";
import { MessageType } from "../utils/MessageTypes";
import { ChatInputCommandInteraction } from "discord.js";
import StopCommandListener from "./StopCommandListener";
import Listener from "./Listener";

const interactionResponseEmitter = new events.EventEmitter();

const LISTENERS: Listener[] = [
    new PlayCommandListener(interactionResponseEmitter),
    new StopCommandListener(interactionResponseEmitter)
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
        interactionResponseEmitter.emit(messageType, content);
    }
}
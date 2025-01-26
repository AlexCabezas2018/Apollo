import events from 'events'
import { ChatInputCommandInteraction } from "discord.js";

import Listener from "./Listener";
import { MessageType } from "../utils/MessageTypes";

import PlayCommandListener from "./PlayCommandListener";
import StopCommandListener from "./StopCommandListener";
import ResumeCommandListener from "./ResumeCommandListener";
import QueueCommandListener from "./QueueCommandListener";
import PauseCommandListener from "./PauseCommandListener";
import NextCommandListener from "./NextCommandListener";
import ChangeLanguageCommandListener from "./ChangeLanguageCommandListener";
import SelectCommandListener from "./SelectCommandListener";

const interactionResponseEmitter = new events.EventEmitter();

const LISTENERS: Listener[] = [
    new PlayCommandListener(interactionResponseEmitter),
    new StopCommandListener(interactionResponseEmitter),
    new ResumeCommandListener(interactionResponseEmitter),
    new QueueCommandListener(interactionResponseEmitter),
    new PauseCommandListener(interactionResponseEmitter),
    new NextCommandListener(interactionResponseEmitter),
    new ChangeLanguageCommandListener(interactionResponseEmitter),
    new SelectCommandListener(interactionResponseEmitter)
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
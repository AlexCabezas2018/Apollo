import { Preferences } from "../preferences/GuildPreferences";

export enum MessageType {
    COMMAND_NOT_FOUND = "COMMAND_NOT_FOUND",
    HELLO_COMMAND_SUCCESS_RESPONSE = "HELLO_COMMAND_SUCCESS_RESPONSE",
    UNEXPECTED_ERROR = "UNEXPECTED_ERROR",
    USER_NOT_IN_VOICE_CHANNEL = "USER_NOT_IN_VOICE_CHANNEL",
    PLAY_COMMAND_WRONG_URL = "PLAY_COMMAND_WRONG_URL",
    PLAY_COMMAND_RESOURCE_ERROR = "PLAY_COMMAND_RESOURCE_ERROR",
    PLAY_COMMAND_SUCCESS_RESPONSE = "PLAY_COMMAND_SUCCESS_RESPONSE",
    STOP_COMMAND_NOTHING_TO_STOP = "STOP_COMMAND_NOTHING_TO_STOP",
    STOP_COMMAND_SUCCESS_RESPONSE = "STOP_COMMAND_SUCCESS_RESPONSE",
    PAUSE_COMMAND_NOTHING_TO_PAUSE = "PAUSE_COMMAND_NOTHING_TO_PAUSE",
    PAUSE_COMMAND_SUCCESS_RESPONSE = "PAUSE_COMMAND_SUCCESS_RESPONSE",
    RESUME_COMMAND_NOTHING_TO_RESUME = "RESUME_COMMAND_NOTHING_TO_RESUME",
    RESUME_COMMAND_SUCCESS_RESPONSE = "RESUME_COMMAND_SUCCESS_RESPONSE",
    CHANGE_LANGUAGE_COMMAND_SUCCESS_RESPONSE = "CHANGE_LANGUAGE_COMMAND_SUCCESS_RESPONSE"
}

export const Messages = {
    get(preferences: Preferences, messageType: MessageType): string {
        const messages = getMessages(preferences);
        return messages[messageType];
    },

    getAndReplace(preferences: Preferences, messageType: MessageType, ...variables: string[]): string {
        const message = this.get(preferences, messageType);
        const variablesIterator = variables.entries()

        return message.replace(/#\$#/g, () => {
            const value = variablesIterator.next().value || [0, "N/A"];
            return String(value[1]);
        });
    }
}

const getMessages = (preferences: Preferences): any => {
    const language = preferences.language;
    return require(`../../priv/messages/${language}.json`);
}
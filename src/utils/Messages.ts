import messages from '../../priv/messages.json'

export enum MessageType {
    COMMAND_NOT_FOUND = "COMMAND_NOT_FOUND",
    HELLO_COMMAND_SUCCESS_RESPONSE = "HELLO_COMMAND_SUCCESS_RESPONSE",
    UNEXPECTED_ERROR = "UNEXPECTED_ERROR",
    USER_NOT_IN_VOICE_CHANNEL = "USER_NOT_IN_VOICE_CHANNEL",
    BOT_ALREADY_IN_USE = "BOT_ALREADY_IN_USE",
    PLAY_COMMAND_URL_NOT_PROVIDED = "PLAY_COMMAND_URL_NOT_PROVIDED",
    PLAY_COMMAND_RESOURCE_ERROR = "PLAY_COMMAND_RESOURCE_ERROR",
    PLAY_COMMAND_SUCCESS_RESPONSE = "PLAY_COMMAND_SUCCESS_RESPONSE",
    STOP_COMMAND_NOTHING_TO_STOP = "STOP_COMMAND_NOTHING_TO_STOP",
    STOP_COMMAND_SUCCESS_RESPONSE = "STOP_COMMAND_SUCCESS_RESPONSE",
    PAUSE_COMMAND_NOTHING_TO_PAUSE = "PAUSE_COMMAND_NOTHING_TO_PAUSE",
    PAUSE_COMMAND_SUCCESS_RESPONSE = "PAUSE_COMMAND_SUCCESS_RESPONSE",
    RESUME_COMMAND_NOTHING_TO_RESUME = "RESUME_COMMAND_NOTHING_TO_RESUME",
    RESUME_COMMAND_SUCCESS_RESPONSE = "RESUME_COMMAND_SUCCESS_RESPONSE"
}

export const Messages = {
    get(messageType: MessageType): string {
        return messages[messageType];
    },

    getAndReplace(messageType: MessageType, ...variables: string[]): string {
        const message = this.get(messageType);
        const variablesIterator = variables.entries()

        return message.replace(/#\$#/g, () => {
            const value = variablesIterator.next().value || [0, "N/A"];
            return String(value[1]);
        });
    }
}
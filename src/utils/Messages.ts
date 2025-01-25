import { Preferences } from "../preferences/GuildPreferences";
import { MessageType } from "./MessageTypes";

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
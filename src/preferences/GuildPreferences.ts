import { Logger } from "../utils/Logger";

export enum SupportedLanguages {
    SPANISH = "es",
    ENGLISH = "en",
}

export interface Preferences {
    language: SupportedLanguages;
}

export class GuildPreferences {
    static instance: GuildPreferences;
    private readonly preferences: Map<string, Preferences>;

    constructor() {
        this.preferences = new Map();
    }

    static getInstance() {
        if (!this.instance) this.instance = new GuildPreferences();
        return this.instance;
    }

    getPreferences(guildId: string | null): Preferences {
        if (!guildId) {
            Logger.error("Error getting guild preferences. Returning default values.");
            return { language: SupportedLanguages.ENGLISH };
        }

        const preferences = this.preferences.get(guildId);
        if (!preferences) {
            const defaultPreferences = {
                language: SupportedLanguages.ENGLISH
            }
            this.preferences.set(guildId, defaultPreferences);
            return defaultPreferences;
        }
        return preferences;
    }

    updatePreferences(guildId: string, preferences: Preferences): void {
        this.preferences.set(guildId, preferences);
    }
}
import { Logger } from "../utils/Logger";
import { SearchResult } from "../seachprovider/SearchResult";

export enum SupportedLanguages {
    SPANISH = "es",
    ENGLISH = "en",
}

export interface Preferences {
    language: SupportedLanguages,
    searchResults: SearchResult[]
}

const DEFAULT_PREFERENCES: Preferences = { language: SupportedLanguages.ENGLISH, searchResults: [] }

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
            return DEFAULT_PREFERENCES;
        }

        const preferences = this.preferences.get(guildId);
        if (!preferences) {
            this.preferences.set(guildId, DEFAULT_PREFERENCES);
            return DEFAULT_PREFERENCES;
        }

        return preferences;
    }

    updatePreferences(guildId: string, preferences: Preferences): void {
        this.preferences.set(guildId, preferences);
    }
}
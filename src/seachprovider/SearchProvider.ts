import { SearchInput } from "./SearchInput";
import { SearchResult } from "./SearchResult";
import YoutubeSearchProvider from "./YoutubeSearchProvider";
import SoundCloudSearchProvider from "./SoundCloudSearchProvider";

const SEARCH_PROVIDERS: Map<string, SearchProvider> = new Map([
    ["youtube", new YoutubeSearchProvider()],
    ["soundcloud", new SoundCloudSearchProvider()],
]);

export const SearchProviderDelegator = {
    search: async (searchInput: SearchInput): Promise<string> => {
        const searchProvider = SEARCH_PROVIDERS.get(searchInput.provider);
        const results = await searchProvider.search(searchInput.term);
        return toPrettyString(results);
    }
}

const toPrettyString = (results: SearchResult[]): string => {
    return results.reduce((acc, result, currentIndex) => {
        return acc + `${currentIndex + 1}. ${result.title}\n`
    }, "");
}

export interface SearchProvider {
    search(term: string): Promise<SearchResult[]>;
}
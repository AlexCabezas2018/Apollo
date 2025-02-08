import { SearchType, SoundCloudPlugin } from "@distube/soundcloud";


import { SearchResult } from "./SearchResult";
import { SearchProvider } from "./SearchProvider";

const plugin = new SoundCloudPlugin();

export default class SoundCloudSearchProvider implements SearchProvider {
    async search(term: string): Promise<SearchResult[]> {
        const results = await plugin.search(term, SearchType.Track, 4);
        return results.map((result) => {
            return {
                title: result.name,
                url: result.url,
                duration: result.formattedDuration
            }
        })
    }
}
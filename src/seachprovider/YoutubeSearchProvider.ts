import { SearchResult } from "./SearchResult";
import { SearchProvider } from "./SearchProvider";

import * as youtubeApi from 'youtube-search-api'

const YOUTUBE_PREFIX = "https://www.youtube.com/watch?v=";

export default class YoutubeSearchProvider implements SearchProvider {
    async search(term: string): Promise<SearchResult[]> {
        const results = await youtubeApi.GetListByKeyword(term, false, 4);
        return results.items.map((item: any): SearchResult => {
            return {
                title: item.title,
                url: YOUTUBE_PREFIX + item.id,
                duration: item.length.simpleText
            }
        });
    }
}
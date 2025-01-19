import ytdl from '@distube/ytdl-core'
import { Logger } from '../utils/Logger'
import AudioProvider, { AudioProviderResponse, AudioProviderResponseStatus } from "./AudioProvider";

export default class YoutubeAudioProvider implements AudioProvider {
    async get(url: string): Promise<AudioProviderResponse> {
        try {
            if (!ytdl.validateURL(url)) {
                return {
                    status: AudioProviderResponseStatus.UNKNOWN_URL,
                    title: 'n/a',
                    audioData: 'n/a'
                }
            }

            const stream = ytdl(url, { filter: 'audioonly' })
            const basicInfo = await ytdl.getInfo(url)

            return {
                status: AudioProviderResponseStatus.SUCCESS,
                title: basicInfo.videoDetails.title,
                audioData: stream
            }
        } catch (error) {
            Logger.error(error)
            return {
                status: AudioProviderResponseStatus.ERROR,
                title: 'n/a',
                audioData: 'n/a'
            }
        }
    }
}

import ytdl from '@distube/ytdl-core'
import { Logger } from '../utils/Logger'
import AudioProvider from "./AudioProvider";
import { AudioProviderResponseStatus, AudioData } from "./AudioData";

export default class YoutubeAudioProvider implements AudioProvider {
    async get(url: string): Promise<AudioData> {
        try {
            if (!ytdl.validateURL(url)) {
                return {
                    status: AudioProviderResponseStatus.UNKNOWN_URL,
                    title: 'n/a',
                    audioResource: 'n/a'
                }
            }

            const stream = ytdl(url, { filter: 'audioonly' })
            const basicInfo = await ytdl.getInfo(url)

            return {
                status: AudioProviderResponseStatus.SUCCESS,
                title: basicInfo.videoDetails.title,
                audioResource: stream
            }
        } catch (error) {
            Logger.error(error)
            return {
                status: AudioProviderResponseStatus.ERROR,
                title: 'n/a',
                audioResource: 'n/a'
            }
        }
    }
}

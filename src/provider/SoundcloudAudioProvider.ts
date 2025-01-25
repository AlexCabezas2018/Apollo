import AudioProvider, { AudioData, AudioProviderResponseStatus } from "./AudioProvider";
import scdl from "soundcloud-downloader";
import { Logger } from "../utils/Logger";

export default class SoundcloudAudioProvider implements AudioProvider {
    async get(url: string): Promise<AudioData> {
        try {
            const stream = await scdl.download(url);
            const basicInfo = await scdl.getInfo(url);

            return {
                status: AudioProviderResponseStatus.SUCCESS,
                title: basicInfo.title || "n/a",
                audioResource: stream
            };
        } catch (error) {
            Logger.error(error);
            return {
                status: AudioProviderResponseStatus.ERROR,
                title: 'n/a',
                audioResource: 'n/a'
            };
        }
    }
}

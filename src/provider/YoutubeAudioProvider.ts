import ytdl from "@distube/ytdl-core"
import {Readable} from "node:stream";
import {Logger} from "../utils/logger";

export enum AudioProviderResponseStatus {
    SUCCESS = 0,
    ERROR = 1,
    UNKNOWN_URL = 2
}

export interface AudioProviderResponse {
    status: AudioProviderResponseStatus;
    name: string;
    audioData: Readable | string;
}


export const YoutubeAudioProvider = {
    async getAudio(url: string): Promise<AudioProviderResponse> {
        try {
            if (!ytdl.validateURL(url)) {
                return {
                    status: AudioProviderResponseStatus.UNKNOWN_URL,
                    name: "n/a",
                    audioData: "n/a"
                }
            }

            const stream = ytdl(url, {filter: "audioonly"});
            const basicInfo = await ytdl.getInfo(url)

            return {
                status: AudioProviderResponseStatus.SUCCESS,
                name: basicInfo.videoDetails.title,
                audioData: stream,
            }
        } catch (error) {
            Logger.error(error);
            return {
                status: AudioProviderResponseStatus.ERROR,
                name: "n/a",
                audioData: "n/a"
            }
        }
    }
}
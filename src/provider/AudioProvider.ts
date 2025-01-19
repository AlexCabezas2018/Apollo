import { Readable } from "node:stream";

export enum AudioProviderResponseStatus {
    SUCCESS = 0,
    ERROR = 1,
    UNKNOWN_URL = 2
}

export interface AudioProviderResponse {
    status: AudioProviderResponseStatus
    title: string
    audioData: Readable | string
}

export default interface AudioProvider {
    get(url: string): Promise<AudioProviderResponse>
}
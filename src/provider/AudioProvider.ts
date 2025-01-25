import { AudioData } from "./AudioData";

export default interface AudioProvider {
    get(url: string): Promise<AudioData>
}
import AudioProvider from "./AudioProvider";
import YoutubeAudioProvider from "./YoutubeAudioProvider";
import SoundcloudAudioProvider from "./SoundcloudAudioProvider";

interface ProviderFactorEntry {
    key: string;
    provider: AudioProvider;
}

const PROVIDERS: ProviderFactorEntry[] = [
    { key: "youtube", provider: new YoutubeAudioProvider() },
    { key: "soundcloud", provider: new SoundcloudAudioProvider() },
];

export const AudioProviderFactory = {
    getProvider(url: string): AudioProvider | undefined {
        return PROVIDERS.find((provider) => {
            return url.includes(provider.key);
        })?.provider;
    }
}


import AudioProvider from "./AudioProvider";
import YoutubeAudioProvider from "./YoutubeAudioProvider";
import SoundcloudAudioProvider from "./SoundcloudAudioProvider";

interface ProviderFactorEntry {
    key: string;
    provider: AudioProvider;
    providerName: string;
}

const PROVIDERS: ProviderFactorEntry[] = [
    { key: "youtube", provider: new YoutubeAudioProvider(), providerName: "youtube" },
    { key: "soundcloud", provider: new SoundcloudAudioProvider(), providerName: "soundcloud" },
];

export const AudioProviderFactory = {
    getProvider(url: string): ProviderFactorEntry | undefined {
        return PROVIDERS.find((provider) => {
            return url.includes(provider.key);
        });
    }
}


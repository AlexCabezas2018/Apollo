import scdl from "soundcloud-downloader";
import SoundcloudAudioProvider from "../../src/provider/SoundcloudAudioProvider";
import { AudioProviderResponseStatus } from "../../src/provider/AudioData";

describe('get(url)', () => {
    const url = 'https://soundcloud.com/droserose/lets-meet'

    test('should return error response when data function throws error', async () => {
        scdl.download = (): Promise<any> => {
            throw new Error('error downloading soundcloud');
        }

        expect(await new SoundcloudAudioProvider().get(url)).toStrictEqual({
            status: AudioProviderResponseStatus.ERROR,
            title: 'n/a',
            audioResource: 'n/a'
        })
    })
})

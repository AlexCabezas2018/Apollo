import YoutubeAudioProvider from '../../src/provider/YoutubeAudioProvider'
import ytdl from '@distube/ytdl-core'
import { AudioProviderResponseStatus } from "../../src/provider/AudioProvider";

describe('get(url)', () => {
    const url = 'https://www.youtube.com/watch?v=Yw6u6YkTgQ4'

    test('should return error response on invalid url', async () => {
        ytdl.validateURL = jest.fn(() => false)

        expect(await new YoutubeAudioProvider().get(url)).toStrictEqual({
            status: AudioProviderResponseStatus.UNKNOWN_URL,
            title: 'n/a',
            audioData: 'n/a'
        })
    })

    test('should return error response when data function throws error', async () => {
        ytdl.getInfo = jest.fn(() => {
            throw new Error("I'm an error")
        })

        ytdl.validateURL = jest.fn(() => true)

        expect(await new YoutubeAudioProvider().get(url)).toStrictEqual({
            status: AudioProviderResponseStatus.ERROR,
            title: 'n/a',
            audioData: 'n/a'
        })
    })
})

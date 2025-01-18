import {YoutubeAudioProvider, AudioProviderResponseStatus} from "../../src/provider/YoutubeAudioProvider";
import ytdl from "@distube/ytdl-core";

describe("getAudio(url)", () => {
    const url = "https://www.youtube.com/watch?v=Yw6u6YkTgQ4"

    test("should return error response on invalid url", async () => {
        ytdl.validateURL = jest.fn(() => false);

        expect(await YoutubeAudioProvider.getAudio(url)).toStrictEqual({
            status: AudioProviderResponseStatus.UNKNOWN_URL,
            name: "n/a",
            audioData: "n/a"
        });
    });

    test("should return error response when data function throws error", async () => {
        ytdl.getInfo = jest.fn(() => {
            throw new Error("I'm an error")
        });

        ytdl.validateURL = jest.fn(() => true);

        expect(await YoutubeAudioProvider.getAudio(url)).toStrictEqual({
            status: AudioProviderResponseStatus.ERROR,
            name: "n/a",
            audioData: "n/a"
        });
    });
})
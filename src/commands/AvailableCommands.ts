import Command from "./Command";
import PlayCommand from "./PlayCommand";
import HelloCommand from "./HelloCommand";

export const COMMANDS = new Map<string, Command>([
    ["hello", new HelloCommand()],
    ["play", new PlayCommand()]
]);
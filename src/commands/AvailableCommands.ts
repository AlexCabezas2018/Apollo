import Command from './Command'
import PlayCommand from './PlayCommand'
import HelloCommand from './HelloCommand'
import StopCommand from './StopCommand'
import PauseCommand from "./PauseCommand";
import ResumeCommand from "./ResumeCommand";
import ChangeLanguageCommand from "./ChangeLanguageCommand";
import QueueCommand from "./QueueCommand";

export const COMMANDS = new Map<string, Command>([
    ['hello', new HelloCommand()],
    ['play', new PlayCommand()],
    ['stop', new StopCommand()],
    ['pause', new PauseCommand()],
    ['resume', new ResumeCommand()],
    ['lang', new ChangeLanguageCommand()],
    ['queue', new QueueCommand()],
])

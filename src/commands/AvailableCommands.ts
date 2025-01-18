import Command from './Command'
import PlayCommand from './PlayCommand'
import HelloCommand from './HelloCommand'
import StopCommand from './StopCommand'

export const COMMANDS = new Map<string, Command>([
    ['hello', new HelloCommand()],
    ['play', new PlayCommand()],
    ['stop', new StopCommand()]
])

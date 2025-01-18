import commands from '../../priv/commands.json'
import {Config} from '../../config'
import {Logger} from './Logger';
import {REST, Routes} from 'discord.js';

const CommandsInstaller = {
    install: (): void => {
        Logger.info("Registering commands...")

        const rest = new REST({version: '10'}).setToken(Config.botToken)

        rest.put(Routes.applicationCommands(Config.applicationId), {body: commands.commands})
            .then(() => Logger.info("Commands successfully registered"))
            .catch(err => Logger.error(`Error installing commands: ${err}`));
    }
}

CommandsInstaller.install()
import {DiscordRequests} from "./discordRequest";
import commands from '../../priv/commands.json'
import {Config} from '../../config'
import {Logger} from './logger';

const CommandsInstaller = {
    install: (): void => {
        Logger.info("Registering commands")
        // API endpoint to overwrite global commands
        const endpoint = `applications/${Config.applicationId}/commands`;

        DiscordRequests.execute(endpoint, {method: 'PUT', body: commands.commands})
            .then(() => Logger.info("Commands successfully installed"))
            .catch(err => Logger.error(`Error installing commands: ${err}`));
    }
}

CommandsInstaller.install()
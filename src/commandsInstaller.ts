import {DiscordRequests} from "./utils/discordRequest";
import commands from '../priv/commands.json'
import {Logger} from './utils/logger';

export const CommandsInstaller = {
    install: (): void => {
        const appId = process.env.APPLICATION_ID;

        // API endpoint to overwrite global commands
        const endpoint = `applications/${appId}/commands`;

        DiscordRequests.execute(endpoint, {method: 'PUT', body: commands.commands})
            .then(() => Logger.info("Commands successfully installed"))
            .catch(err => Logger.error(`Error installing commands: ${err}`));
    }
}
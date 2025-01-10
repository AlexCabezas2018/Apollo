import {DiscordRequests} from "./utils/discordRequest";
import commands from '../priv/commands.json'

export const CommandsInstaller = {
    install: (): void => {
        const appId = process.env.APPLICATION_ID;

        console.log('Installing commands...');

        // API endpoint to overwrite global commands
        const endpoint = `applications/${appId}/commands`;

        DiscordRequests.execute(endpoint, {method: 'PUT', body: commands.commands})
            .then(() => console.log("Commands successfully installed"))
            .catch(err => console.error(`Error installing commands: ${err}`));
    }
}
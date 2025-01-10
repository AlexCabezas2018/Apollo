import {DiscordRequests} from "./utils/discordRequest";
import fs from "fs";

const COMMANDS_PATH = "priv/commands.json";

export const CommandsInstaller = {
    install: (): void => {
        const appId = process.env.APPLICATION_ID;

        console.log('Installing commands...');

        // API endpoint to overwrite global commands
        const endpoint = `applications/${appId}/commands`;

        const {commands} = JSON.parse(fs.readFileSync(COMMANDS_PATH));

        DiscordRequests.execute(endpoint, {method: 'PUT', body: commands})
            .then(() => console.log("Commands successfully installed"))
            .catch(err => console.error(`Error installing commands: ${err}`));
    }
}
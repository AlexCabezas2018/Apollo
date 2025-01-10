import {DiscordRequests} from "./utils/discordRequest";

export const CommandsInstaller = {
    install: (): void => {
        const appId = process.env.APPLICATION_ID;

        console.log('Installing commands...');

        // API endpoint to overwrite global commands
        const endpoint = `applications/${appId}/commands`;

        const commands: any[] = [
            {
                name: 'hello',
                description: 'It just a test command',
                type: 1,
                integration_types: [0, 1],
                contexts: [0, 1, 2],
            }
        ];

        DiscordRequests.execute(endpoint, {method: 'PUT', body: commands})
            .then(() => console.log("Commands successfully installed"))
            .catch(err => console.error(`Error installing commands: ${err}`));
    }
}
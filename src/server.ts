import express, {Express, Request, Response} from "express";
import {InteractionResponseType, InteractionType, verifyKeyMiddleware} from "discord-interactions";
import {CommandsInstaller} from './commandsInstaller'
import {Logger} from './utils/logger';

export const Server = {
    start: (): void => {
        const app: Express = express();
        const port = process.env.PORT || 3000;
        const publicKey: string = process.env.PUBLIC_KEY || "not-defined";

        app.listen(port, () => {
            CommandsInstaller.install()
            Logger.info(`[server]: Server is running at http://localhost:${port}`);
        });

        app.post("/interactions", verifyKeyMiddleware(publicKey), (req: Request, res: Response) => {
            // Interaction type and data
            const {type, data} = req.body;

            if (type == InteractionType.APPLICATION_COMMAND) {
                const commandName = data.name;
                if (commandName == "hello") {
                    res.send({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            content: `hello world!!!`,
                        },
                    });
                    return;
                }
            }

            res.status(400).json({error: 'unknown command'});
        });
    }
}
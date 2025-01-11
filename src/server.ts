import express, {Express, Request, Response} from "express";
import {InteractionResponseType, InteractionType, verifyKeyMiddleware} from "discord-interactions";
import {Logger} from './utils/logger';
import {Config} from "../config";

export const Server = {
    start: (): void => {
        const app: Express = express();
        const port = Config.port;

        app.listen(port, () => {
            Logger.info(`[server]: Server is running at http://localhost:${port}`);
        });

        app.post("/interactions", verifyKeyMiddleware(Config.publicKey), (req: Request, res: Response) => {
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

                if (commandName == "play") {
                    const url = data.options[0].value
                    res.send({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            content: `Okay, I will play ${url}!`,
                        },
                    });

                    return;
                }
            }

            res.status(400).json({error: 'unknown command'});
        });
    }
}
import { Server } from './src/server'
import { Logger } from './src/utils/Logger'
import { PubSub } from "./src/events/PubSub";

PubSub.init(() => {
    Logger.info("Listeners up and ready!")
});

Server.start()
    .then(() => Logger.info('[server] Server ready!'))
    .catch(err => Logger.error(`[server] Error while trying to start server: ${err}`))

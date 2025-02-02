import { Server } from './src/Server'
import { Logger } from './src/utils/Logger'
import { PubSub } from "./src/events/PubSub";
import { Server as MetricsServer } from "./src/metrics/Server";

PubSub.init(() => {
    Logger.debug("[pub-sub] Listeners up and ready!")
});

Server.start()
    .then(() => Logger.info('[server] Server ready!'))
    .catch(err => Logger.error(`[server] Error while trying to start server: ${err}`))

MetricsServer.start()
    .then(() => Logger.info('[metrics] Metrics ready!'))
    .catch(err => Logger.error(`[metrics] Error while trying to start metrics server: ${err}`))
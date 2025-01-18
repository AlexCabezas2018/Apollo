import { Server } from './src/server'
import { Logger } from './src/utils/Logger'

Server.start()
    .then(() => Logger.info('[server] Server ready!'))
    .catch(err => Logger.error(`[server] Error while trying to start server: ${err}`))

console.log("aaaaa")
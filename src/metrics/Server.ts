import express from 'express'
import { Metrics } from './Metrics';
import { Config } from "../../Config";


export const Server = {
    start: async () => {
        const app = express();

        app.get('/metrics', async (_request, response) => {
            const metrics = await Metrics.expose()

            response.setHeader('Content-Type', metrics.contentType);
            response.end(metrics.data);
        });

        app.listen(Config.metricsPort, (error) => {
            if (error) {
                return Promise.reject(error);
            }
            return Promise.resolve();
        });
    }
}
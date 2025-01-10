import express, { Express, Request, Response } from "express";

export default class Server {
    start(): void {
        const app: Express = express();
        const port = process.env.PORT || 3000;

        app.listen(port, () => {
            console.log(`[server]: Server is running at http://localhost:${port}`);
        });

        app.get("/", (req: Request, res: Response) => {
            res.send("Express + TypeScript Server");
        });
    }
}








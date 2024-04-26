import express, {Express, NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import {mongoConnection} from "./infrastructor/db";
import bodyParser from "body-parser";
import pokemonRoutes from "./controller/routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());
const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
};

app.use(loggerMiddleware);

app.use('/api', pokemonRoutes)

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});


async function startApp() {
    try {
        await mongoConnection.connect();
    } catch (err) {
        console.error('Error starting the application:', err);
        await mongoConnection.close();
    }

}

startApp().then(/*do nothing*/);

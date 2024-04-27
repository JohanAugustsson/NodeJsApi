import express, {Express, NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import {PokemonControllers} from "./controller/pokemon/pokemonControllers";
import {container, Lifecycle} from "tsyringe";
import {IPokemonRepository} from "./infrastructor/pokemon/iPokemonRepository";
import {PokemonRepository} from "./infrastructor/pokemon/pokemonRepositoy";
import {IMongoDb, MongoDb} from "./infrastructor/mongoDb";
import {IPokemonAppService} from "./applicationContracts/pokemon/iPokemonAppService";
import {PokemonAppService} from "./application/pokemon/pokemonAppService";
import {BadRequest, InternalServerError, NotFound} from "./errors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());
const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
};

app.use(loggerMiddleware);


container.register<IPokemonRepository>("IPokemonRepository", { useClass: PokemonRepository })
container.register<IPokemonAppService>("IPokemonAppService", { useClass: PokemonAppService })
container.register<IMongoDb>("IMongoDb", { useClass: MongoDb}, { lifecycle: Lifecycle.Singleton})


// Register controllers, extracts metadata from class (router) and then add it
const controllers = [PokemonControllers];
controllers.forEach(controller => {
    const instance = container.resolve(controller);
    const routePrefix = Reflect.getMetadata('routePrefix', controller);
    app.use(routePrefix, instance.getRouter());
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});



app.use(function (e: any, req: Request, res: Response) {

    console.error(e, 'Parameters: ', req.params)

    if(e instanceof BadRequest){
        return res.status(400).send(e.message)
    }

    if(e instanceof NotFound){
        return res.status(404).send(e.message)
    }

    if(e instanceof InternalServerError){
        return res.status(500).send(e.message)

    }

    return res.status(500).send('Something went wrong');
});
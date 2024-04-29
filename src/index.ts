import 'reflect-metadata';
import fs from "fs"
import YAML from 'yamljs';
import express, {Express} from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import {container, Lifecycle} from "tsyringe";
import swaggerUi from "swagger-ui-express"
import {PokemonControllers} from "./controller/pokemon/pokemonControllers";
import {IPokemonRepository} from "./infrastructor/pokemon/iPokemonRepository";
import {PokemonRepository} from "./infrastructor/pokemon/pokemonRepositoy";
import {IMongoDb, MongoDb} from "./infrastructor/mongoDb";
import {IPokemonAppService} from "./applicationContracts/pokemon/iPokemonAppService";
import {PokemonAppService} from "./application/pokemon/pokemonAppService";
import {useExpressServer} from "routing-controllers";

// Dependency injection
container.register<IPokemonRepository>("IPokemonRepository", {useClass: PokemonRepository})
container.register<IPokemonAppService>("IPokemonAppService", {useClass: PokemonAppService})
container.register<IMongoDb>("IMongoDb", {useClass: MongoDb}, {lifecycle: Lifecycle.Singleton})


dotenv.config();

const app: Express = express();


useExpressServer(app, {
    routePrefix: '/api',
    controllers: [PokemonControllers]
})


const port = process.env.PORT || 3000;

app.use(bodyParser.json());


// Swagger config
const file  = fs.readFileSync('./swagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
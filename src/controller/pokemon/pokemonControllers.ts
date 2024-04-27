import {Controller} from "../controller";
import {NextFunction, Request, Response, Router} from "express";
import {inject} from "tsyringe";
import {Pokemon} from "../../domain/pokemon/pokemon";
import {PokemonRepository} from "../../infrastructor/pokemon/pokemonRepositoy";
import {PokemonAppService} from "../../application/pokemon/pokemonAppService";
import {BadRequest} from "../../errors";


@Controller('/api/pokemon')
export class PokemonControllers {
    private router = Router();

    constructor(
        @inject("IPokemonRepository") private readonly pokemonRepository: PokemonRepository,
        @inject("IPokemonAppService") private readonly pokemonAppService: PokemonAppService,
    ) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/', this.create.bind(this));
        this.router.get('/', this.byType.bind(this));
        this.router.get('/:id', this.byId.bind(this));
        this.router.get('/by-name', this.byName.bind(this));
        this.router.get('/random', this.random.bind(this));
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        const pokemonData = req.body;
        const pokemon = Pokemon.create(pokemonData);

        if (!pokemon) {
            next(new BadRequest('Bad request'))
            return;
        }

        let response;
        try {
            response = await this.pokemonAppService.create(pokemon)
        } catch (e) {
            next(e);
        }
        return res.status(200).send(response);
    }

    public async byName(req: Request, res: Response): Promise<Response> {
        return res.status(200).send('not implemented')
    }

    public async byType(req: Request, res: Response, next: NextFunction) {
        const type = req.query.type ?? "";
        const name = req.query.name ?? "";
        const sort = req.query.sort ?? "";

        if (typeof type !== "string" || typeof sort !== "string" || typeof name !== "string" ){
            return next(new BadRequest('Bad request'))
        }

        let pokemonList: Pokemon[] = []

        try {
            pokemonList = await this.pokemonAppService.byType(type, name, sort);
        } catch(e){
            next(e)
        }


        return res.status(200).json(pokemonList);

    }

    public async random(req: Request, res: Response): Promise<Response> {
        return res.status(200).send('not implemented')
    }

    public async byId(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id ?? "";

        const idNumber = parseInt(id);
        if (isNaN(idNumber)){
            return next(new BadRequest('Invalid id'))
        }

       try {
           const pokemon = await this.pokemonAppService.byId(idNumber)
           return res.status(200).json(pokemon);
       } catch (e){
           next(e)
       }
    }

    public getRouter() {
        return this.router;
    }

}

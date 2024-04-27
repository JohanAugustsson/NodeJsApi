import {container} from "tsyringe";
import {BadRequestError, Body, Get, JsonController, Param, Post, QueryParam} from "routing-controllers";
import {IPokemon, Pokemon} from "../../domain/pokemon/pokemon";
import {IPokemonAppService} from "../../applicationContracts/pokemon/iPokemonAppService";


@JsonController('/pokemon')
export class PokemonControllers {
    private pokemonAppService: IPokemonAppService;

    constructor() {
        this.pokemonAppService = container.resolve('IPokemonAppService')
    }

    @Post('/')
    public async create(@Body() inputPokemon: IPokemon) {

        const pokemon = Pokemon.create(inputPokemon);

        if (!pokemon) {
            throw new BadRequestError('Invalid request data pokemon')
        }

        return await this.pokemonAppService.create(pokemon)
    }

    @Get('/byName')
    public async byName() {
        return 'not implemented'
    }

    @Get('/')
    public async byType(
        @QueryParam("type") type: string,
        @QueryParam("name") name: string,
        @QueryParam("sort") sort: string
    ) {
        return await this.pokemonAppService.byType(type, name, sort);
    }


    @Get('/random')
    public async random() {
        return 'not implemented'
    }



    @Get('/:id')
    async byId(@Param('id') id: string) {
        const idNumber = parseInt(id);

        if (isNaN(idNumber)) {
            throw new BadRequestError('Invalid id');
        }

        return await this.pokemonAppService.byId(idNumber);
    }

}

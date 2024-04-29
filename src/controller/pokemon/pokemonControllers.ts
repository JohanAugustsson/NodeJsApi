import {container} from "tsyringe";
import {
    BadRequestError,
    Body,
    Delete,
    Get,
    HttpCode,
    JsonController,
    Param,
    Post,
    QueryParam
} from "routing-controllers";
import {IPokemonAppService} from "../../applicationContracts/pokemon/iPokemonAppService";
import {mockedPokemonList} from "../../infrastructor/raw";
import {IPokemonDto, PokemonDto} from "../../applicationContracts/pokemon/pokemonDto";
import {validatePokemonInput} from "../validators";


@JsonController('/pokemon')
export class PokemonControllers {
    private pokemonAppService: IPokemonAppService;

    constructor() {
        this.pokemonAppService = container.resolve('IPokemonAppService')
    }

    @HttpCode(201)
    @Post('/')
    public async create(@Body() inputPokemon: IPokemonDto) {

        const response = validatePokemonInput(inputPokemon)

        if (response !== 'success'){
            throw new BadRequestError(response)
        }



        const pokemon = new PokemonDto(inputPokemon)

        if (!pokemon) {
            throw new BadRequestError('Invalid request data pokemon')
        }

        await this.pokemonAppService.create(pokemon)

        return 'Success'
    }

    @Get('/')
    public async all(): Promise<PokemonDto[]> {
        return await this.pokemonAppService.byType("", "", "id")
    }

    @Get('/mock')
    public async mock(): Promise<string> {

        const mock = mockedPokemonList.map(p => new PokemonDto(p))

        await this.pokemonAppService.mock(mock)
        return 'Added mocked pokemon:s to database'
    }

    @Delete('/delete')
    public async delete(): Promise<string> {
        await this.pokemonAppService.dropCollection()
        return 'Success'
    }

    @Get('/byName')
    public async byName(@QueryParam('name') name: string): Promise<PokemonDto[]> {
        if (name?.length < 3){
            throw new BadRequestError('Name must be at least 3 char');
        }
        return await this.pokemonAppService.byName(name)
    }

    @Get('/byType')
    public async byType(
        @QueryParam("type") type: string,
        @QueryParam("name") name: string,
        @QueryParam("sort") sort: string
    ) {
        return await this.pokemonAppService.byType(type, name, sort);
    }


    @Post('/weak-against')
    public async random(@Body() inputPokemon: IPokemonDto) {
        const response = validatePokemonInput(inputPokemon)

        if (response !== 'success'){
            throw new BadRequestError(response)
        }

        const pokemonDto = new PokemonDto(inputPokemon)

        const resp = await this.pokemonAppService.weakAgainst(pokemonDto)

        if (resp === null){
            return 'Could not find any strong opponent'
        }

        return resp;
    }


    @Get('/:id')
    async byId(@Param('id') id: string): Promise<PokemonDto[]> {
        const idNumber = parseInt(id);

        if (isNaN(idNumber)) {
            throw new BadRequestError('Invalid id');
        }

        return await this.pokemonAppService.byId(idNumber);
    }

}

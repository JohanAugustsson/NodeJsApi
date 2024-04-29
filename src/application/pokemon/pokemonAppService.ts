import {Pokemon} from "domain/pokemon/pokemon";
import {inject, injectable} from "tsyringe";
import {BadRequestError, InternalServerError} from "routing-controllers";
import {IPokemonAppService} from "../../applicationContracts/pokemon/iPokemonAppService";
import {PokemonRepository} from "../../infrastructor/pokemon/pokemonRepositoy";
import {PokemonDto} from "../../applicationContracts/pokemon/pokemonDto";
import {PokemonMapper} from "../mapper";

@injectable()
export class PokemonAppService implements IPokemonAppService {
    constructor(
        @inject("IPokemonRepository") private readonly pokemonRepository: PokemonRepository
    ) {
    }

    async dropCollection(): Promise<boolean> {
        return await this.pokemonRepository.dropCollection()
    }

    async mock(input: PokemonDto[]): Promise<void> {

        const pokemonList = input.map(p => PokemonMapper.fromDto(p))

        const isOk = await this.pokemonRepository.insertMany(pokemonList)

        if (!isOk){
            throw  new InternalServerError('Could not add pokemon:s to database')
        }

        return;
    }

    async weakAgainst(pokemon: PokemonDto): Promise<PokemonDto | null> {
        const weakness = pokemon.weaknesses ?? []
        const pokemonList = await this.pokemonRepository.filter(weakness, "", "")
        if (pokemonList === null) {
            throw new InternalServerError('Something went wrong when try to fetch pokemon:s')
        }

        const filteredPokemon = pokemonList.filter(p => p.weaknesses.every(weakness => !pokemon.type.includes(weakness)))

        return this.getRandomPokemon(filteredPokemon);
    }

    async byName(name: string): Promise<PokemonDto[]> {
        const response = await this.pokemonRepository.fuzzySearch(name)
        if (typeof response === 'string') {
            throw new InternalServerError(response)
        }

        return response.map(p => PokemonMapper.toDto(p));
    }

    async byId(id: number): Promise<PokemonDto[]> {
        const pokemonList = await this.getByIdIncludeEvolution([Number(id)])

        return pokemonList.sort((a, b) => a.id - b.id);
    }

    async byType(type: string, name: string, sort: string): Promise<PokemonDto[]> {
        const pokemonList = await this.pokemonRepository.filter([type], name, sort);

        if (pokemonList === null) {
            throw new InternalServerError('Something went wrong when try to fetch pokemon:s')
        }

        return pokemonList.map(p => PokemonMapper.toDto(p))
    }

    async create(pokemon: PokemonDto): Promise<PokemonDto> {

        const pokemonExists = await this.pokemonRepository.findOne({id: pokemon.id})
        if (pokemonExists) {
            throw new BadRequestError('Pokemon already exists')
        }

        const evoIds = this.extractEvolutionIds(pokemon);

        if (this.hasDuplicates(evoIds)) {
            throw new BadRequestError('Duplicated number found in evolution')
        }

        const promises = evoIds.map(async id => {
            const pokemon = await this.pokemonRepository.findOne({id})
            return pokemon?.id ?? null
        })

        const ids = await Promise.all(promises)
        const notExistingIds = evoIds.filter(id => !ids.includes(id))

        if (notExistingIds.length > 0) {
            throw new BadRequestError(`Could not be created due evolutions dose not exist: ${notExistingIds.join(',')}`)
        }


        const pok = PokemonMapper.fromDto(pokemon)

        const success = await this.pokemonRepository.create(pok);

        if (!success) {
            throw new InternalServerError('unable to create pokemon')
        }

        return pokemon;

    }

    private extractEvolutionIds(pokemon: PokemonDto): number[] {
        const nextEvoIds = (pokemon.next_evolution ?? []).map(ev => Number(ev.num));
        const prevEvoIds = (pokemon.prev_evolution ?? []).map(ev => Number(ev.num));
        return [...nextEvoIds, ...prevEvoIds]
    }

    private hasDuplicates(ids: number[]): boolean {
        const currentNumber: number[] = []
        let hasDuplicates = false;
        for (const id of ids) {
            if (currentNumber.includes(id)) {
                hasDuplicates = true;
                break;
            }
            currentNumber.push(id);
        }
        return hasDuplicates;
    }


    private async getByIdIncludeEvolution(ids: number[], fetchedPokemonList: PokemonDto[] = []): Promise<PokemonDto[]> {
        const pokemonList = await this.pokemonRepository.byIds(ids);
        const pokemonListDto = pokemonList.map(p => PokemonMapper.toDto(p))

        fetchedPokemonList.push(...pokemonListDto);

        const evoIds = pokemonListDto.flatMap(pok => this.extractEvolutionIds(pok));

        const fetchedIds = fetchedPokemonList.map(p => p.id);
        const toBeFetched = evoIds.filter(id => !fetchedIds.includes(id))

        // remove duplicates create method of this instead
        const uniqueNumberToBeFetchedSet = new Set(toBeFetched);
        const uniqueNumberToBeFetchArray = [...uniqueNumberToBeFetchedSet]

        if (uniqueNumberToBeFetchArray.length > 0) {
            const nestedPokemonList = await this.getByIdIncludeEvolution(uniqueNumberToBeFetchArray, fetchedPokemonList);
            return [...pokemonListDto, ...nestedPokemonList];
        }

        return pokemonListDto;
    }

    private getRandomPokemon(pokemonList: Pokemon[]): PokemonDto | null {
        if (pokemonList.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * pokemonList.length);
        return PokemonMapper.toDto(pokemonList[randomIndex])
    }
}





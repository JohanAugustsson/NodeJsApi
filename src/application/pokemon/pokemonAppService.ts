import { Pokemon } from "domain/pokemon/pokemon";
import {IPokemonAppService} from "../../applicationContracts/pokemon/iPokemonAppService";
import {inject, injectable} from "tsyringe";
import {PokemonRepository} from "../../infrastructor/pokemon/pokemonRepositoy";
import {BadRequest, InternalServerError} from "../../errors";


@injectable()
export class PokemonAppService implements IPokemonAppService {
    constructor(
        @inject("IPokemonRepository") private readonly pokemonRepository: PokemonRepository
    ) {
    }

    async byId(id: number): Promise<Pokemon[]> {
        const pokemonList = await this.getByIdIncludeEvolution([Number(id)])

        return pokemonList.sort((a, b) => a.id - b.id);
    }

    async byType(type: string, name: string, sort: string): Promise<Pokemon[]> {
        const pokemonList = await this.pokemonRepository.byType(type, name, sort);

        if (pokemonList === null){
            throw new InternalServerError('Something went wrong when try to fetch pokemon:s')
        }

        return pokemonList;
    }

    async create(pokemon: Pokemon): Promise<Pokemon> {

        const pokemonExists = await this.pokemonRepository.findOne({id: pokemon.id})
        if (pokemonExists){
            throw new BadRequest('Pokemon already exists')
        }

        const evoIds = this.extractEvolutionIds(pokemon);

        if (this.hasDuplicates(evoIds)){
            throw new BadRequest('Duplicated number found in evolution')
        }

        const promises = evoIds.map(async id => {
            const pokemon = await this.pokemonRepository.findOne({id})
            return pokemon?.id ?? null
        })

        const ids = await Promise.all(promises)
        const notExistingIds = evoIds.filter(id => !ids.includes(id))

        if (notExistingIds.length > 0){
            throw new BadRequest(`Could not be created due evolutions dose not exist: ${notExistingIds.join(',')}`)
        }


        const success = await this.pokemonRepository.create(pokemon);

        if (!success){
            throw new InternalServerError('unable to create pokemon')
        }

        return pokemon;

    }

    private extractEvolutionIds(pokemon: Pokemon): number[] {
        const nextEvoIds = (pokemon.next_evolution ?? []).map(ev => Number(ev.num));
        const prevEvoIds = (pokemon.prev_evolution ?? []).map(ev => Number(ev.num));
        return [...nextEvoIds, ...prevEvoIds]
    }

    private hasDuplicates(ids: number[]): boolean {
        const currentNumber:number[] = []
        let hasDuplicates = false;
        for(const id of ids){
            if (currentNumber.includes(id)){
                hasDuplicates = true;
                break;
            }
            currentNumber.push(id);
        }
        return hasDuplicates;
    }


    private async getByIdIncludeEvolution(ids: number[], fetchedPokemonList: Pokemon[] = []): Promise<Pokemon[]> {
        const pokemonList = await this.pokemonRepository.byIds(ids);
        fetchedPokemonList.push(...pokemonList);

        const evoIds = pokemonList.flatMap(pok => this.extractEvolutionIds(pok));

        const fetchedIds = fetchedPokemonList.map(p => p.id);
        const toBeFetched = evoIds.filter(id => !fetchedIds.includes(id))

        // remove duplicates create method of this instead
        const uniqueNumberToBeFetchedSet = new Set(toBeFetched);
        const uniqueNumberToBeFetchArray = [...uniqueNumberToBeFetchedSet]

        if (uniqueNumberToBeFetchArray.length > 0) {
            const nestedPokemonList = await this.getByIdIncludeEvolution(uniqueNumberToBeFetchArray, fetchedPokemonList);
            return [...pokemonList, ...nestedPokemonList];
        }

        return pokemonList;
    }


}





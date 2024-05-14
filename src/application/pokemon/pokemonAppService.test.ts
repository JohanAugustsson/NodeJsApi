import "reflect-metadata"
import {container} from "tsyringe";
import {IPokemonRepository} from "../../infrastructor/pokemon/iPokemonRepository";
import {IPokemonAppService} from "../../applicationContracts/pokemon/iPokemonAppService";
import {PokemonAppService} from "./pokemonAppService";
import {IPokemon, Pokemon} from "../../domain/pokemon/pokemon";


const pokemon: IPokemon = {
    avg_spawns: 0,
    candy: "",
    candy_count: 0,
    egg: 0,
    height: 0,
    id: 1,
    img: "",
    multipliers: [],
    name: "Ivysaur",
    next_evolution: [],
    num: "",
    prev_evolution: [],
    spawn_chance: 0,
    spawn_time: 0,
    type: [],
    weaknesses: [],
    weight: 0
}
const mockedPokemonOne = new Pokemon(pokemon)
const mockedPokemonTwo = new Pokemon({...pokemon, id: 2, name: "Bulbasaur" })

class MockedPokemonRepository implements IPokemonRepository {
    create(pokemon: Pokemon): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    dropCollection(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    findOne(criteria: Record<string, string | number>): Promise<Pokemon | null> {
        throw new Error("Method not implemented.");
    }

    byId(id: number): Promise<Pokemon | null> {
        const resp = [mockedPokemonOne, mockedPokemonTwo].find(pokemon => pokemon.id === id)
        return Promise.resolve(resp ?? null);
    }

    byIds(ids: number[]): Promise<Pokemon[]> {
        const resp = [mockedPokemonOne, mockedPokemonTwo].filter(pokemon => ids.includes(pokemon.id))
        return Promise.resolve(resp)
    }

    getAll(): Promise<Pokemon[]> {
        throw new Error("Method not implemented.");
    }

    fuzzySearch(name: string): Promise<string | Pokemon[]> {
        throw new Error("Method not implemented.");
    }

    filter(type: string[], name: string, sort: string): Promise<Pokemon[] | null> {
        throw new Error("Method not implemented.");
    }
}


container.register<IPokemonRepository>('IPokemonRepository', {useClass: MockedPokemonRepository});
container.register<IPokemonAppService>('IPokemonAppService', {useClass: PokemonAppService});

describe("PokemonAppService",  () => {

    test("Fetch a single pokemon", async () => {
        const pokemonAppService: IPokemonAppService = container.resolve('IPokemonAppService')

        const result = await pokemonAppService.byId(mockedPokemonOne.id)

        const pokemonFound = result[0];

        expect(result.length).toBe(1)

        expect(pokemonFound.id).toBe(mockedPokemonOne.id)
    })

    test("Should return empty array due pokemon dose not exists", async () => {

        const pokemonAppService: IPokemonAppService = container.resolve('IPokemonAppService')

        let result= await pokemonAppService.byId(4)

        expect(result.length).toBe(0)
    })
})

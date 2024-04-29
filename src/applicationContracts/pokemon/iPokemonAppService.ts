import {PokemonDto} from "./pokemonDto";

export interface IPokemonAppService {
    create(pokemon: PokemonDto): Promise<PokemonDto>

    mock(pokemon: PokemonDto[]): Promise<void>

    dropCollection(): Promise<boolean>

    byType(type: string, name: string, sort: string): Promise<PokemonDto[]>

    byId(id: number): Promise<PokemonDto[]>

    byName(name: string): Promise<PokemonDto[]>

    weakAgainst(pokemon: PokemonDto): Promise<PokemonDto | null>
}
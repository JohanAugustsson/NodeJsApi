import {Pokemon} from "../../domain/pokemon/pokemon";

export interface IPokemonAppService {
    create(pokemon: Pokemon): Promise<Pokemon>

    byType(type: string, name: string, sort: string): Promise<Pokemon[]>

    byId(id: number): Promise<Pokemon[]>

    byName(name: string): Promise<Pokemon[]>
}
import {Pokemon} from "../../domain/pokemon/pokemon";


export interface IPokemonRepository {
    create(pokemon: Pokemon): Promise<boolean>

    findOne(criteria: Record<string, string | number>): Promise<Pokemon | null>

    byId(id: number): Promise<Pokemon | null>

    byIds(ids: number[]): Promise<Pokemon[]>

    getAll(): Promise<Pokemon[]>

    byType(type: string, name: string, sort: string): Promise<Pokemon[] | null>
}
import {Collection} from "mongodb";
import {Pokemon} from "../../domain/pokemon/pokemon";
import {mongoConnection} from "../db";

export class PokemonRepository {
    collection: Collection<Pokemon> | null
    collectionName: string = 'pokemon'

    constructor() {
        this.collection = mongoConnection.db?.collection<Pokemon>(this.collectionName) ?? null;
    }

    public async create(pokemon: Pokemon) : Promise<boolean>{
        try {
            await this.collection?.insertOne(pokemon)
            return true
        } catch (e) {
            console.log('Could not create pokemon')
            return false;
        }
    }


    public async findOne(criteria: Record<string, string | number>): Promise<Pokemon | null> {
        try {
            const pokemonRaw = await this.collection?.findOne(criteria)
            return Pokemon.create(pokemonRaw);
        } catch (e)
        {
            console.log(e);
            return null;
        }

    }

    public async byId(id: number): Promise<Pokemon | null> {
        try {
            const pokemonRaw = await this.collection?.findOne({ id });
            return Pokemon.create(pokemonRaw);
        } catch (e)
        {
            console.log(e);
            return null;
        }

    }

    public async byIds(ids: number[]): Promise<Pokemon[]> {
        try {
            const resp = await this.collection?.find({ id: { $in: ids } }).toArray();

            if (Array.isArray(resp)){
                const a = resp.map(p => Pokemon.create(p))
                if (a == null){
                    return []
                }
                return a.filter(element => element !== null) as Pokemon[];
            }
            return [];

        } catch (e)
        {
            console.log(e);
            return [];
        }

    }

    public async getAll(): Promise<Pokemon[]>{
        try {

            const resp = await this.collection?.find().sort('name').toArray()

            if (Array.isArray(resp)){
                const a = resp.map(p => Pokemon.create(p))
                if (a == null){
                    return []
                }
                return a.filter(element => element !== null) as Pokemon[];
            }
            return [];
        } catch (e)
        {
            console.log(e);
            return [];
        }
    }



    public async byType(type: string, name: string, sort: string): Promise<Pokemon[] | null> {
        try {
            const query: Record<string, any> = {}
            if (type !== ""){
                const regex = new RegExp(type, 'i');
                query.type = { $regex: regex }
            }
            if (name !== ""){
                const regex = new RegExp(name, 'i');
                query.name = { $regex: regex }
            }

            const sortBy = sort !== "" ? sort : "id";


            const resp = await this.collection?.find(query).sort(sortBy).toArray()

            if (Array.isArray(resp)){
                const a = resp.map(p => Pokemon.create(p))
                if (a == null){
                    return []
                }
               return a.filter(element => element !== null) as Pokemon[];
            }
            return [];
        } catch (e)
        {
            console.log(e);
            return null;
        }

    }

}


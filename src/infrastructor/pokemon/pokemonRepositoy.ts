import {Collection} from "mongodb";
import {Pokemon} from "../../domain/pokemon/pokemon";
import {inject, injectable} from "tsyringe";
import {IPokemonRepository} from "./iPokemonRepository";
import {IMongoDb} from "../mongoDb";

@injectable()
export class PokemonRepository implements IPokemonRepository {
    private readonly collectionName: string = 'pokemon'

    constructor(@inject("IMongoDb") private mongoDb: IMongoDb) {
    }

    public async fuzzySearch(name: string): Promise<Pokemon[] | string> {

        const regexPattern = new RegExp(`.*${name}.*`, 'i'); // 'i' flag for case-insensitive search

        const db = await this.db()
        if (!db) {
            console.error('Database connection not available.');
            return 'Unable to connect to database';
        }

        try {
            const resp = await db.find({name: {$regex: regexPattern}}).sort('id').toArray()
            return this.parseToPokemon(resp);

        } catch (e: any) {
            console.log(e?.message)
            return 'Something went wrong when try to search database'
        }
    }

    private async db(): Promise<Collection<any> | undefined> {
        return await this.mongoDb.getCollection(this.collectionName)
    }

    public async create(pokemon: Pokemon): Promise<boolean> {
        try {
            const db = await this.db()
            if (!db) {
                console.error('Database connection not available.');
                return false;
            }

            await db.insertOne(pokemon)
            return true
        } catch (e) {
            console.log('Could not create pokemon')
            return false;
        }
    }


    public async findOne(criteria: Record<string, string | number>): Promise<Pokemon | null> {
        try {
            const db = await this.db()
            if (!db) {
                console.error('Database connection not available.');
                return null;
            }

            const pokemonRaw = await db?.findOne(criteria)
            return Pokemon.create(pokemonRaw);
        } catch (e) {
            console.log(e);
            return null;
        }

    }

    public async byId(id: number): Promise<Pokemon | null> {
        try {
            const db = await this.db()
            if (!db) {
                console.error('Database connection not available.');
                return null;
            }

            const pokemonRaw = await db.findOne({id});
            return Pokemon.create(pokemonRaw);
        } catch (e) {
            console.log(e);
            return null;
        }

    }

    public async byIds(ids: number[]): Promise<Pokemon[]> {
        try {
            const db = await this.db()
            if (!db) {
                console.error('Database connection not available.');
                return [];
            }

            const resp = await db?.find({id: {$in: ids}}).toArray();
            return this.parseToPokemon(resp);

        } catch (e) {
            console.log(e);
            return [];
        }

    }

    public async getAll(): Promise<Pokemon[]> {
        try {
            const db = await this.db()
            if (!db) {
                console.error('Database connection not available.');
                return [];
            }
            const resp = await db?.find().sort('name').toArray()
            return this.parseToPokemon(resp);
        } catch (e) {
            console.log(e);
            return [];
        }
    }


    public async filter(type: string, name: string, sort: string): Promise<Pokemon[] | null> {
        try {
            const query: Record<string, any> = {}
            if (type !== "") {
                const regex = new RegExp(type, 'i');
                query.type = {$regex: regex}
            }
            if (name !== "") {
                const regex = new RegExp(name, 'i');
                query.name = {$regex: regex}
            }

            const sortBy = sort !== "" ? sort : "id";

            const db = await this.db()
            if (!db) {
                console.error('Database connection not available.');
                return null;
            }
            const resp = await db.find(query).sort(sortBy).toArray()
            return this.parseToPokemon(resp);
        } catch (e) {
            console.log(e);
            return null;
        }
    }


    private parseToPokemon(data: any) {
        if (Array.isArray(data)) {
            const pokemonList = data.map(p => Pokemon.create(p))
            return pokemonList.filter(element => element !== null) as Pokemon[];
        }
        return [];
    }
}


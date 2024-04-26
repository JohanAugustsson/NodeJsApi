import { Request, Response} from "express";

import {Pokemon} from "../../domain/pokemon/pokemon";
import {PokemonRepository} from "../../infrastructor/pokemon/pokemon-repository";


class PokemonController {
    async byId(req: Request, res: Response): Promise<Response> {
        const id = req.params.id;

        const pokemonList = await PokemonController.getByIdIncludeEvolution([Number(id)])

        const sorted = pokemonList.sort((a,b) => a.id - b.id);

        if(sorted.length === 0){
            return res.status(404).send();
        }

        return res.status(200).send(sorted)
    }


     static async getByIdIncludeEvolution(ids: number[], fetchedPokemonList: Pokemon[] = []): Promise<Pokemon[]> {
        const pokemonList = await new PokemonRepository().byIds(ids);
        fetchedPokemonList.push(...pokemonList);

        const evoIds = pokemonList.flatMap(pok => PokemonController.extractEvolutionIds(pok));

        const fetchedIds = fetchedPokemonList.map(p => p.id);
        const toBeFetched = evoIds.filter(id => !fetchedIds.includes(id))

        // remove duplicates create method of this instead
        const uniqueNumberToBeFetchedSet = new Set(toBeFetched);
        const uniqueNumberToBeFetchArray = [...uniqueNumberToBeFetchedSet]

        if (uniqueNumberToBeFetchArray.length > 0) {
            const nestedPokemonList = await PokemonController.getByIdIncludeEvolution(uniqueNumberToBeFetchArray, fetchedPokemonList);
            return [...pokemonList, ...nestedPokemonList];
        }

        return pokemonList;
    }

     static extractEvolutionIds(pokemon: Pokemon): number[] {
        const nextEvoIds = (pokemon.next_evolution ?? []).map(ev => Number(ev.num));
        const prevEvoIds = (pokemon.prev_evolution ?? []).map(ev => Number(ev.num));
        return [...nextEvoIds, ...prevEvoIds]
    }


    async byType(req: Request, res: Response): Promise<Response> {

        const type = req.query.type ?? "";
        const name = req.query.name ?? "";
        const sort = req.query.sort ?? "";

        if (typeof type !== "string" || typeof sort !== "string" || typeof name !== "string" ){
            return res.status(400).send('Wrong format')
        }

        const pokemon = await new PokemonRepository().byType(type, name, sort);

        if (pokemon == null){
            return res.status(500).send('something went wrong')
        }
        return res.status(200).send(pokemon)
    }

    // Create an API endpoint that searches for a pokémon by name.
    // The endpoint should accept a string parameter with a minimum length of three. The parameter should expect the name of a pokémon.
    // Matching the name should be fuzzy.

    async byName(req: Request, res: Response): Promise<Response> {
        return res.status(200).send('not implemented')
    }

    // Create an API endpoint that returns a suggested pokémon.
    // It should accept a pokémon as a parameter.
    // It should return a pokémon that has a type that the provided pokémon is weak against. The returned pokémon should not be weak vs. the provided pokémon.
    async suggested(req: Request, res: Response): Promise<Response> {
        return res.status(200).send('not implemented')
    }

    // Create an API endpoint to add a pokémon to the database.
    // It should accept a pokémon as a parameter.
    // It should be possible to add a pokémon as the next or previous evolution of a already existing pokémon in the database.
    // Todo: Make sure that next and previous evolution is pointing to the same id
    async create(req: Request, res: Response): Promise<Response> {
        const pokemonData = req.body;
        const pokemon = Pokemon.create(pokemonData);

        if (pokemon == null){
            return res.status(400).send('invalid format');
        }

        // const pokemonExists = await new PokemonRepository().findOne({id: pokemon.id})
        // if (pokemonExists){
        //     return res.status(400).send(`Pokemon with id ${pokemon.id} already exists`)
        // }

        const evoIds = PokemonController.extractEvolutionIds(pokemon);

        if (PokemonController.hasDuplicates(evoIds)){
            return res.status(400).send('Duplicated number found in evolution')
        }

        const promises = evoIds.map(async id => {
            const pokemon = await new PokemonRepository().findOne({id})
            return pokemon?.id ?? null
        })

        const ids = await Promise.all(promises)
        const notExistingIds = evoIds.filter(id => !ids.includes(id))

        if (notExistingIds.length > 0){
            return res.status(400).send(`Could not be created due evolution is not existing: ${notExistingIds.join(',')}`)
        }


        const repo = await new PokemonRepository().create(pokemon)
        if (!repo){
            return res.status(500).send('something went wrong');
        }

        return res.status(200).send(pokemon);
    }

    static hasDuplicates(ids: number[]): boolean {
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


    async all(req: Request, res: Response): Promise<Response> {

        const repo = await new PokemonRepository().getAll()
        if (!repo){
            return res.status(500).send('something went wrong');
        }

        return res.status(200).send(repo);
    }
}

export default new PokemonController()

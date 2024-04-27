import {pokemonSchema} from "./pokemonSchema";

export class Evolution {
    num: string;
    name: string;
    constructor(data: any) {
        this.num = data?.num;
        this.name = data?.name;
    }
}

export interface IPokemon {
    id: number;
    num: string;
    name: string
    img: string;
    type: string[];
    height: string; // "0.71 m"
    weight: string; // "6.9 kg",
    candy: string; // "Bulbasaur Candy",
    candy_count: number; // 25,
    egg: string; // "2 km",
    spawn_chance: number; // 0.69,
    avg_spawns: number; // 69,
    spawn_time: string; // "20:00";
    multipliers: number[];
    weaknesses: string[];
    next_evolution: Evolution[]
}

export class Pokemon implements IPokemon{
    id: number;
    num: string;
    name: string
    img: string;
    type: string[];
    height: string; // "0.71 m"
    weight: string; // "6.9 kg",
    candy: string; // "Bulbasaur Candy",
    candy_count: number; // 25,
    egg: string; // "2 km",
    spawn_chance: number; // 0.69,
    avg_spawns: number; // 69,
    spawn_time: string; // "20:00";
    multipliers: number[];
    weaknesses: string[];
    next_evolution: Evolution[]
    prev_evolution: Evolution[]

    private constructor(data: any) {
        this.id = data.id
        this.num = data.num
        this.name = data.name
        this.img = data.img
        this.type = data.type
        this.height = data.height
        this.weight = data.weight
        this.candy = data.candy
        this.candy_count = data.candy_count
        this.egg = data.egg
        this.spawn_chance = data.spawn_chance
        this.avg_spawns = data.avg_spawns
        this.spawn_time = data.spawn_time
        this.multipliers = data.multipliers
        this.weaknesses = data.weaknesses
        this.next_evolution = data.next_evolution
        this.prev_evolution = data.prev_evolution
    }

    static create(data: any): Pokemon | null {
       try {
           const validData= pokemonSchema.parse(data)
           return new Pokemon(validData)
       } catch (error){
           console.log('Unable to parse data', error)
           return null;
       }
    }
}


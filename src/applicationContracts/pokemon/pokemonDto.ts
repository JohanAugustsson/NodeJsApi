export class EvolutionDto {
    num: string;
    name: string;
    constructor(data: any) {
        this.num = data?.num;
        this.name = data?.name;
    }
}

export interface IPokemonDto {
    id: number;
    num: string;
    name: string
    img: string;
    type: string[];
    height: string;
    weight: string;
    candy: string;
    candy_count?: number;
    egg: string;
    spawn_chance: number;
    avg_spawns: number;
    spawn_time: string;
    multipliers: number[] | null;
    weaknesses: string[];
    next_evolution?: EvolutionDto[]
    prev_evolution?: EvolutionDto[]
}

export class PokemonDto implements IPokemonDto {
    id: number;
    num: string;
    name: string
    img: string;
    type: string[];
    height: string;
    weight: string;
    candy: string;
    candy_count: number;
    egg: string;
    spawn_chance: number;
    avg_spawns: number;
    spawn_time: string;
    multipliers: number[] | null;
    weaknesses: string[];
    next_evolution: EvolutionDto[]
    prev_evolution: EvolutionDto[]

    constructor(data: any) {
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
}
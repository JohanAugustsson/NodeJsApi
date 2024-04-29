import {IPokemonDto, PokemonDto} from "../applicationContracts/pokemon/pokemonDto";
import {Pokemon} from "../domain/pokemon/pokemon";


export class PokemonMapper {
    static fromDto(dto: IPokemonDto): Pokemon {
        return new Pokemon({
            id: dto.id,
            num: dto.num,
            name: dto.name,
            img: dto.img,
            type: dto.type,
            height: toNumberValue(dto.height),
            weight: toNumberValue(dto.weight),
            candy: dto.candy,
            candy_count: dto.candy_count ?? -1,
            egg: toNumberValue(dto.egg),
            spawn_chance: dto.spawn_chance,
            avg_spawns: dto.avg_spawns,
            spawn_time: toSec(dto.spawn_time),
            multipliers: dto.multipliers ?? [],
            weaknesses: dto.weaknesses,
            next_evolution: dto.next_evolution ?? [],
            prev_evolution: dto.prev_evolution ?? []
        });
    }

    static toDto(pokemon: Pokemon): PokemonDto {
        return new PokemonDto({
            id: pokemon.id,
            num: pokemon.num,
            name: pokemon.name,
            img: pokemon.img,
            type: pokemon.type,
            height: `${pokemon.height} m`,
            weight: `${pokemon.weight} kg`,
            candy: pokemon.candy,
            candy_count: pokemon.candy_count,
            egg: `${pokemon.egg} km`,
            spawn_chance: pokemon.spawn_chance,
            avg_spawns: pokemon.avg_spawns,
            spawn_time: secondsToMinutesAndSeconds(pokemon.spawn_time),
            multipliers: pokemon.multipliers,
            weaknesses: pokemon.weaknesses,
            next_evolution: pokemon.next_evolution,
            prev_evolution: pokemon.prev_evolution
        });
    }
}

const toSec = (time: string): number =>{
    const _time = time.split(":")
    const timeMinutes = Number(_time[0])
    const timeSeconds = Number(_time[1])

    const minutesInSec = isNaN(timeMinutes) ? 0 : timeMinutes * 60;
    const sec = isNaN(timeSeconds) ? 0 : timeSeconds

    return minutesInSec + sec;
}

const toNumberValue = (value: string): number =>{
    const val = Number(value.split(' ')[0]);
    return isNaN(val) ? 0 : val
}

const secondsToMinutesAndSeconds = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const convertedSec = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${convertedSec}`;
}
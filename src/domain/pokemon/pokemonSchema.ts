import { z } from 'zod';

const evolutionSchema = z.object({
    num: z.string(),
    name: z.string()
});

export const pokemonSchema = z.object({
    id: z.number(),
    num: z.string(),
    name: z.string(),
    img: z.string(),
    type: z.array(z.string()),
    height: z.number(),
    weight: z.number(),
    candy: z.string(),
    candy_count: z.number(),
    egg: z.number(),
    spawn_chance: z.number(),
    avg_spawns: z.number(),
    spawn_time: z.number(),
    multipliers: z.array(z.number()),
    weaknesses: z.array(z.string()),
    next_evolution: z.array(evolutionSchema),
    prev_evolution: z.array(evolutionSchema),
});

export const inputPokemonSchema = z.object({
    id: z.number(),
    num: z.string(),
    name: z.string(),
    img: z.string(),
    type: z.array(z.string()),
    height: z.string(),
    weight: z.string(),
    candy: z.string(),
    candy_count: z.number().optional(),
    egg: z.string(),
    spawn_chance: z.number(),
    avg_spawns: z.number(),
    spawn_time: z.string(),
    multipliers: z.array(z.number()).nullable(),
    weaknesses: z.array(z.string()),
    next_evolution: z.array(evolutionSchema).optional(),
    prev_evolution: z.array(evolutionSchema).optional(),
});


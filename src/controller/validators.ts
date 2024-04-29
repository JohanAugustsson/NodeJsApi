import {inputPokemonSchema} from "../domain/pokemon/pokemonSchema";
import {ZodError} from "zod";


export const validatePokemonInput = (input: any): string | any => {
    try {
        inputPokemonSchema.parse(input)
        return 'success'
    } catch (error){
        if (error instanceof ZodError) {
            return error.issues.map(issue => ({
                code: issue.code,
                message: issue.message,
                path: issue.path.join('.'),
            }));
        } else {
            return 'Bad request'
        }
    }
}
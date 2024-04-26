import {Router} from 'express';
import PokemonController from "./pokemon/pokemon-controller";

const router = Router();
const routerName = 'pokemon'



router.get(`/${routerName}/by-name`, PokemonController.byName);
router.get(`/${routerName}/suggestion`, PokemonController.suggested);
router.post(`/${routerName}`, PokemonController.create);


// Create an API endpoint that filters Pokémon by type.
// The endpoint should accept a type as a parameter and return all Pokémon of that type.
// It should accept sorting as a parameter. Should be able to sort on most properties (for example weight).
// TODO: ADD weight.. need to clean the data
router.get(`/${routerName}`, PokemonController.byType);


// Create an API endpoint that gets a pokémon by its ID.
// It should return next and previous evolutions as well.
// If its next or previous evolutions have further evolutions, those should be included as well.
// TODO: Currently we do not handle errors, example: if mongodb is down
router.get(`/${routerName}/:id`, PokemonController.byId);

export default router;

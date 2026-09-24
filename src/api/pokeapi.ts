// Library of functions reaching the pokeapi API
//

import { Pokemon, PokemonDetails } from "@/types/types";

// Get the list of every pokemon
export default async function allPokemon(): Promise<Pokemon[]> {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0";
  try {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    const result: unknown = data.results;
    if (!Array.isArray(result)) {
      throw new Error("unexpected data shape");
    }
    return result as Pokemon[];
  } catch (error) {
    console.error((error as Error).message);
    return [];
  }
}
// Get the info of one single pokemon
export async function pokemonInfo(
  name: string,
): Promise<PokemonDetails | null> {
  const url = "https://pokeapi.co/api/v2/pokemon/" + name;
  try {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error((error as Error).message);
    return null;
  }
}
// Get the type of a single pokemon
export async function pokemonType(name: string) {
  const url = "https://pokeapi.co/api/v2/pokemon/" + name;
  try {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    return result.types;
  } catch (error) {
    console.error((error as Error).message);
    return [];
  }
}

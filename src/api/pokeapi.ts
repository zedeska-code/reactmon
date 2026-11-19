// Library of functions reaching the pokeapi API
import { cacheLife } from "next/cache";
import {
  Pokemons,
  PokemonDetails,
  PokemonType,
  PokemonSummary,
} from "@/types/types";

// Get the list of every pokemon
export default async function allPokemon(): Promise<Pokemons[]> {
  "use cache";
  cacheLife("minutes");

  const url = "https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0";

  const response = await fetch(url, { method: "GET" });
  if (!response.ok)
    throw new Error(`Failed to load the pokemon list : ${response.status}`);

  const json = await response.json();
  const results: unknown = json.results;
  if (!Array.isArray(results)) {
    throw new Error("unexpected data shape");
  }
  return results as Pokemons[];
}
// Get summary of one Pokemon
export async function pokemonSummary(name: string): Promise<PokemonSummary> {
  "use cache";

  const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Pokemon not found: ${response.status}`);
  }
  const p: PokemonDetails = await response.json();
  const summary = {
    id: p.id,
    name: p.name,
    sprite: p.sprites.other["official-artwork"].front_default,
    types: p.types.map((t) => t.type.name),
  };
  return summary;
}
// Get the info of one single pokemon
export async function pokemonInfo(name: string): Promise<PokemonDetails> {
  "use cache";
  cacheLife("minutes");

  const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
  const response = await fetch(url, { method: "GET" });

  if (!response.ok) {
    throw new Error(`Pokemon not found: ${response.status}`);
  }

  const json = await response.json();
  return json;
}
// Get the type of a single pokemon
export async function pokemonType(name: string): Promise<PokemonType> {
  "use cache";
  cacheLife("minutes");

  const url = "https://pokeapi.co/api/v2/pokemon/" + name;
  const response = await fetch(url, { method: "GET" });

  if (!response.ok) throw new Error(`Types not found: ${response.status}`);

  const json = await response.json();
  return json.types;
}

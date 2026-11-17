"use server";
// Library of functions reaching the pokeapi API
import { cacheLife } from "next/cache";
import { Pokemon, PokemonDetails, PokemonType } from "@/types/types";

// Get the list of every pokemon
export default async function allPokemon(): Promise<Pokemon[] | void> {
  "use cache";
  cacheLife("minutes");
  const url = "https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0";
  const response = await fetch(url, { method: "GET" });
  const json = await response.json();
  const results: unknown = json.results;

  if (!response.ok) {
    console.log(`Response status: ${response.status}`);
  }
  if (!Array.isArray(results)) {
    return console.log("unexpected data shape");
  }
  return results as Pokemon[];
}
// Get the info of one single pokemon
export async function pokemonInfo(
  name: string,
): Promise<PokemonDetails | void> {
  "use cache";
  cacheLife("minutes");
  const url = "https://pokeapi.co/api/v2/pokemon/" + name;
  const response = await fetch(url, { method: "GET" });
  const json = await response.json();
  if (!response.ok) {
    console.log(`Response status: ${response.status}`);
  }
  return json;
}
// Get the type of a single pokemon
export async function pokemonType(name: string): Promise<PokemonType | void> {
  "use cache";
  cacheLife("minutes");
  const url = "https://pokeapi.co/api/v2/pokemon/" + name;
  const response = await fetch(url, { method: "GET" });
  const json = await response.json();
  if (!response.ok) {
    console.log(`Response status: ${response.status}`);
  }
  return json.types;
}

"use server";

import { PokemonSummary } from "@/types/types";
import { pokemonSummary } from "./pokeapi";

export async function getSummaries(names: string[]): Promise<PokemonSummary[]> {
  if (!Array.isArray(names) || !names.every((n) => typeof n === "string")) {
    throw new Error("Invalid input");
  }
  const summaries = await Promise.all(names.slice(0, 50).map(pokemonSummary));
  return summaries;
}

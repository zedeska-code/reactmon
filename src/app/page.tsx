import allPokemons, { pokemonSummary } from "@/api/pokeapi";
import { PokeCardSkeleton } from "@/components/summaryCard";
import PokeList from "@/components/pokelist";
import { Pokemons } from "@/types/types";

const BATCH = 20;

export default async function Home() {
  const pokemons: Pokemons[] = await allPokemons();
  const pokemonNames = pokemons.map((p: Pokemons) => p.name);
  const firstBatch = await Promise.all(
    pokemonNames.slice(0, BATCH).map(pokemonSummary),
  );
  return (
    <section>
      <PokeList pokemonNames={pokemonNames} firstBatch={firstBatch} />
    </section>
  );
}

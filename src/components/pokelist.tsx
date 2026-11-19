"use client";
import { useLoadMore } from "@/hooks/useLoadMore";
import PokeCard, { PokeCardSkeleton } from "./summaryCard";
import { PokemonSummary } from "@/types/types";

export default function PokeList({
  pokemonNames,
  firstBatch,
}: {
  pokemonNames: string[];
  firstBatch: PokemonSummary[];
}) {
  const { query, setQuery, visiblePokemons, loaded, hasMore, sentinelRef } =
    useLoadMore(pokemonNames, firstBatch);
  return (
    <section className="w-full">
      <article className="flex items-center justify-center">
        <input
          type="text"
          value={query}
          placeholder="Search Pokemon..."
          onChange={(e) => setQuery(e.target.value)}
          className="m-5 p-2 rounded-2xl bg-surface"
        />
      </article>

      <article className="flex flex-col gap-5 items-center justify-center m-auto md:grid md:grid-cols-4 md:max-w-300">
        {visiblePokemons.map((name) => {
          const p = loaded[name];
          return p ? (
            <PokeCard key={name} pokemon={p} />
          ) : (
            <PokeCardSkeleton key={name} />
          );
        })}
      </article>

      <article ref={sentinelRef} style={{ height: 1 }}>
        {visiblePokemons.length === 0 && <p>No Pokémon found.</p>}
        {!hasMore && visiblePokemons.length > 0 && (
          <p>You&apos;ve reached the end</p>
        )}
      </article>
    </section>
  );
}

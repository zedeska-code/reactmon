"use client";
import allPokemon from "@/api/pokeapi";
import { useLoadMore } from "@/hooks/useLoadMore";
import PokeRow from "./pokerow";

export default function Pokelist() {
  const { pokemons, isLoading, hasMore, sentinelRef } = useLoadMore(allPokemon);

  return (
    <div>
      <table className="home m-auto">
        <thead>
          <tr>
            <th>number</th>
            <th>sprite</th>
            <th>name</th>
            <th>type</th>
          </tr>
        </thead>
        <tbody>
          {pokemons.map((pokemon) => (
            <PokeRow key={pokemon.name} pokemon={pokemon} />
          ))}
        </tbody>
      </table>
      <div ref={sentinelRef} style={{ height: 1 }}>
        {isLoading && <p>Loading more...</p>}
        {!hasMore && <p>You&apos;ve reached the end</p>}
      </div>
    </div>
  );
}

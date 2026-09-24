"use client";
import allPokemon from "@/api/pokeapi";
import { useLoadMore } from "@/hooks/useLoadMore";
import PokeRow from "./pokerow";
import { useState } from "react";

export default function Pokelist() {
  const [query, setQuery] = useState("");
  const { pokemons, isLoading, hasMore, sentinelRef } = useLoadMore(
    allPokemon,
    query,
  );

  return (
    <div>
      <div className="flex items-center justify-center">
        <input
          type="text"
          value={query}
          placeholder="Search Pokemon..."
          onChange={(e) => setQuery(e.target.value)}
          className="m-5 p-2 rounded-2xl bg-amber-100 shadow"
        />
      </div>
      <table className="home m-auto">
        <thead>
          <tr className="bg-black text-xl text-white">
            <th className="border">number</th>
            <th className="border">sprite</th>
            <th className="border">name</th>
            <th className="border">type</th>
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

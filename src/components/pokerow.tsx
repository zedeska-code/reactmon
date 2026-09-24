"use client";

import { pokemonInfo } from "@/api/pokeapi";
import { Pokemon, PokemonDetails } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PokeRow({ pokemon }: { pokemon: Pokemon }) {
  const [details, setDetails] = useState<PokemonDetails | null>(null);
  useEffect(() => {
    let cancelled = false;
    pokemonInfo(pokemon.name).then((data) => {
      if (!cancelled) setDetails(data);
    });
    return () => {
      cancelled = true;
    };
  }, [pokemon.name]);

  if (!details)
    return (
      <tr>
        <td colSpan={4}>Loading...</td>
      </tr>
    );
  return (
    <tr>
      <td>{details.id}</td>
      <td>
        <Link href={`/pokemon/${pokemon.name}`} className="bg-red-700">
          <Image
            src={details.sprites.front_default}
            alt={pokemon.name}
            width={60}
            height={60}
          />
        </Link>
      </td>
      <td>
        <Link href={`/pokemon/${pokemon.name}`}>{pokemon.name}</Link>
      </td>
      <td>{details.types.map((t) => t.type.name).join(", ")}</td>
    </tr>
  );
}

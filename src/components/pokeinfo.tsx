"use client";
import { pokemonInfo } from "@/api/pokeapi";
import { PokemonDetails } from "@/types/types";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function InfoCard({ name }: { name: string }) {
  const [details, setDetails] = useState<PokemonDetails | null>(null);
  useEffect(() => {
    pokemonInfo(name).then((data) => setDetails(data));
  }, [name]);
  if (!details) {
    return <div>Loading...</div>;
  }
  return (
    <section className=" flex flex-col justify-center items-center m-20 bg-blue-200 rounded-2xl aspect-square shadow-2xl">
      <div>#{details.id}</div>
      <div>{details.name}</div>
      <Image
        src={details.sprites.front_default}
        alt={details.name}
        width={200}
        height={200}
      />
      <div className="flex items-center justify-center gap-2 ">
        <div>types :</div>

        <div>
          {details.types.map((t) => (
            <div key={t.type.name}>{t.type.name}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

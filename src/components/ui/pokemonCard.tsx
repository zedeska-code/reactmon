"use client";
import { PokemonDetails } from "@/types/types";
import Image from "next/image";

export default function InfoCard({ details }: { details: PokemonDetails }) {
  return (
    <section className=" flex flex-col justify-center items-center m-20 rounded-4xl aspect-square overflow-clip bg-primary-container text-on-primary-container">
      <article className="flex gap-2 bg-primary w-full items-start p-1 justify-center text-on-primary">
        <div className="">{details.id}</div>
        <h2 className="uppercase font-bold text-2xl">{details.name}</h2>
      </article>
      <Image
        src={details.sprites.front_default}
        alt={details.name}
        width={200}
        height={200}
      />
    </section>
  );
}

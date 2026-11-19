import { PokemonDetails } from "@/types/types";
import Image from "next/image";
import { typeBackgroundColor } from "./typeColor";

export default function InfoCard({ pokemon }: { pokemon: PokemonDetails }) {
  const firstType = Array.from(pokemon.types.map((t) => `${t.type.name}`))[0];
  return (
    <section
      className={`${typeBackgroundColor[firstType]} text-foreground w-80 m-auto bg-surface border border-line flex flex-col rounded-4xl`}
    >
      <article className="m-3"></article>
      <article className="m-2 flex justify-center items-center bg-background rounded-4xl">
        <Image
          /* prettier-ignore */
          src={pokemon['sprites']['other']['official-artwork']['front_default']}
          alt={pokemon.name}
          width={200}
          height={200}
        />
      </article>
      <article className="flex gap-1 justify-between items-center m-3">
        <h2 className="uppercase font-bold text-3xl text-white mix-blend-exclusion">
          {pokemon.name}
        </h2>
        <div className="font-bold text-xl">#{pokemon.id}</div>
      </article>
    </section>
  );
}

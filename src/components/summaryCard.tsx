import { PokemonSummary } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { typeBadgeColor } from "./ui/typeColor";

export default function PokeCard({ pokemon }: { pokemon: PokemonSummary }) {
  const id = pokemon.id;
  const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  const href = `/pokemon/${pokemon.name}`;
  return (
    <Link
      className="group flex flex-col gap-1 p-3 justify-center w-80 border border-line bg-surface hover:border-primary rounded-4xl transition md:w-full"
      href={href}
    >
      <article className="font-bold text-xl">#{id}</article>

      <article className="flex items-center justify-center bg-background w-full p-5 rounded-4xl">
        <Image src={sprite} alt={pokemon.name} width={140} height={100} />
      </article>

      <article className="">
        <h2 className="uppercase bold text-2xl font-bold p-2">
          {pokemon.name}
        </h2>
      </article>

      <article className="flex gap-2">
        {pokemon.types.map((t: string) => (
          <div key={t}>
            <div
              className={`flex items-center justify-center font-bold text-md rounded-full border-2 px-3 py-1 ${typeBadgeColor[t]}`}
            >
              {t}
            </div>
          </div>
        ))}
      </article>
    </Link>
  );
}

export function PokeCardSkeleton() {
  return (
    <section className="group flex flex-col gap-1 p-3 justify-center w-3/4 border border-line bg-surface rounded-4xl animate-pulse m-auto">
      <article className="h-5 w-10 bg-background rounded-full"></article>

      <article className=" h-40 flex items-center bg-background w-full p-5 rounded-4xl"></article>

      <article className="">
        <h2 className="h-10 w-50 bg-background rounded-full p-2"></h2>
      </article>

      <article className="h-10 w-30 bg-background rounded-full"></article>
    </section>
  );
}

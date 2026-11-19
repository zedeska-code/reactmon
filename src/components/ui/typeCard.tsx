import { PokemonDetails, PokemonType } from "@/types/types";
import { typeBadgeColor } from "./typeColor";

export default function TypeCard({ pokemon }: { pokemon: PokemonDetails }) {
  return (
    <section className="rounded-4xl bg-surface border border-line m-auto">
      <div className="flex gap-2 p-2">
        {pokemon.types.map((t: PokemonType) => (
          <div
            key={t.type.name}
            className={`${typeBadgeColor[t.type.name]} rounded-full border-2 px-3 text-xl`}
          >
            {t.type.name}
          </div>
        ))}
      </div>
    </section>
  );
}

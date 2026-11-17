import { PokemonDetails, PokemonType } from "@/types/types";

export default function TypeCard({ details }: { details: PokemonDetails }) {
  return (
    <section className="rounded-4xl bg-secondary-container overflow-clip">
      <h3 className="text-center bg-secondary text-on-secondary p-1 text-2xl uppercase font-bold">
        types
      </h3>
      <div className="flex gap-2 p-2">
        {details.types.map((t: PokemonType) => (
          <div key={t.type.name}>{t.type.name}</div>
        ))}
      </div>
    </section>
  );
}

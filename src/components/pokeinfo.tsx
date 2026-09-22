import { pokemonInfo } from "@/app/pokeapi";
import Image from "next/image";

export default async function InfoCard({ name }: { name: string }) {
  const pokemon = await pokemonInfo(name);
  if (!pokemon || Array.isArray(pokemon)) {
    return <div>Pokémon not found.</div>;
  }
  return (
    <section>
      <div>{pokemon.name}</div>
      <Image
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        width={50}
        height={50}
      />
    </section>
  );
}

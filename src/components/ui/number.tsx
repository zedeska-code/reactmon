import { pokemonInfo } from "@/app/pokeapi";

export default async function Number({ name }: { name: string }) {
  const pokemon = await pokemonInfo(name);
  if (!pokemon) {
    return <div>number not found</div>;
  }
  return <div>{pokemon.id}</div>;
}

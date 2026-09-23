import { pokemonType } from "@/app/pokeapi";

export default async function Type({ name }: { name: string }) {
  const pokemon = await pokemonType(name);
  if (!pokemon) {
    return <div>type not found</div>;
  }
  const types = pokemon.map((p: { name: string }) => (
    <div key={p.type.name}>{p.type.name}</div>
  ));
  return types;
}

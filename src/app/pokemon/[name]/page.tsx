import { pokemonInfo } from "@/api/pokeapi";
import PokeDetails from "@/components/pokeDetails";

export const instant = false;

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const pokemon = await pokemonInfo(name);
  return <PokeDetails pokemon={pokemon} />;
}

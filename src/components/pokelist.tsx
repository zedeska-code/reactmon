import allPokemon, from "@/app/pokeapi";
import Link from "next/link";
import Sprite from "./ui/sprite";

export default async function Pokelist() {
  const pokemons = await allPokemon();
  const list = pokemons.map((pokemon: { name: string }) => (

    <li key={pokemon.name}>
      <Sprite name={pokemon.name}/>
      <Link href={`/pokemon/${pokemon.name}`}>{pokemon.name}</Link>
    </li>
  ));
  return list;
}

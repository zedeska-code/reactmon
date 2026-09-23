import allPokemon from "@/app/pokeapi";
import Link from "next/link";
import Sprite from "./ui/sprite";
import Number from "./ui/number";
import Type from "./ui/type";

export default async function Pokelist() {
  const pokemons = await allPokemon();
  const list = pokemons.map((pokemon: { name: string }) => (
    <table key={pokemon.name} className="home m-auto">
      <tr>
        <th>sprite</th>
        <th>number</th>
        <th>name</th>
        <th>type</th>
      </tr>
      <tr>
        <td>
          <Link
            href={`/pokemon/${pokemon.name}`}
            className="flex items-center justify-center"
          >
            <Sprite name={pokemon.name} />
          </Link>
        </td>
        <td>
          <Number name={pokemon.name} />
        </td>
        <td>
          <div>{pokemon.name}</div>
        </td>
        <td>
          <Type name={pokemon.name} />
        </td>
      </tr>
    </table>
  ));
  return list;
}

import { pokemonInfo } from "@/app/pokeapi";
import Image from "next/image";

export default async function Sprite({
  name,
  width = 60,
  height = 60,
}: {
  name: string;
  width?: number;
  height?: number;
}) {
  const pokemon = await pokemonInfo(name);
  if (!pokemon) {
    return <div>Sprite not found !</div>;
  }
  return (
    <div>
      <Image
        src={pokemon.sprites.front_default}
        alt={name}
        width={width}
        height={height}
      />
    </div>
  );
}

import InfoCard from "@/components/ui/pokemonCard";
import { ArrowBackRounded } from "@mui/icons-material";
import TypeCard from "./ui/typeCard";
import IconLink from "./ui/IconLink";
import { PokemonDetails } from "@/types/types";

export default function PokeDetails({ pokemon }: { pokemon: PokemonDetails }) {
  return (
    <section className="flex flex-col gap-3 m-5">
      <InfoCard pokemon={pokemon} />
      <TypeCard pokemon={pokemon} />
      <IconLink
        Icon={ArrowBackRounded}
        href={"/"}
        size="text-7xl"
        className="bg-primary text-surface"
      />
    </section>
  );
}

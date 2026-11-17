import { pokemonInfo } from "@/api/pokeapi";
import InfoCard from "@/components/ui/pokemonCard";
import { Loading } from "@/components/ui/loading";
import { ArrowBackRounded } from "@mui/icons-material";
import Link from "next/link";
import { Suspense } from "react";
import TypeCard from "./ui/typeCard";
import IconLink from "./ui/IconLink";

export default async function PokeDetails({ name }: { name: string }) {
  const details = await pokemonInfo(name);
  if (!details) {
    return "Not found";
  }

  return (
    <section>
      <Suspense fallback={<Loading />}>
        <InfoCard details={details} />
        <TypeCard details={details} />
      </Suspense>
      <IconLink Icon={ArrowBackRounded} href="/" />
    </section>
  );
}

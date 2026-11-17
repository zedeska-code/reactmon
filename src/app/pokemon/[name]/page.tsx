import PokeDetails from "@/components/pokeDetails";

export const instant = false;

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  return <PokeDetails name={name} />;
}

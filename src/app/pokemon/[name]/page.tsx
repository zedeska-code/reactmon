import InfoCard from "@/components/pokeinfo";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  return (
    <div>
      <InfoCard name={name} />
      <div>
        <Link href={"/"}>retour</Link>
      </div>
    </div>
  );
}

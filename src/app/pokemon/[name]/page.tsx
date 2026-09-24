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
        <Link
          href={"/"}
          className="border rounded-2xl m-5 p-2 hover:bg-amber-100"
        >
          retour
        </Link>
      </div>
    </div>
  );
}

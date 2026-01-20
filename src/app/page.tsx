import prisma from "@/../lib/prisma";
import Link from "next/link";

export default async function Home() {
  const plants = await prisma.plant.findMany();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16">
      <h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-geist-sans)] text-[#333333]">
        A Seed! A Bud!
      </h1>
      <ol className="list-decimal list-inside font-[family-name:var(--font-geist-sans)]">
        {plants.map((plant) => (
          <li key={plant.id} className="mb-2">
            <Link href={{ pathname: "/plants/" + plant.id }}>{plant.name}</Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

import prisma from "@/../lib/prisma";
import { notFound } from "next/navigation";

export default async function Post({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plant = await prisma.plant.findUnique({
    where: { id: parseInt(id) },
  });

  if (!plant) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16">
      <article className="max-w-2xl space-y-4 font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-4xl font-bold mb-8 text-[#333333]">{plant.name}</h1>
        <p>Created at {new Date(plant.createdAt).toString()}</p>
        <p>Updated at {new Date(plant.updatedAt).toString()}</p>
      </article>
    </div>
  );
}

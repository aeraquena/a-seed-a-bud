import prisma from "@/../lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function Home() {
  async function waterPlant(formData: FormData) {
    "use server";

    const plantId = Number(formData.get("plantId"));

    await prisma.event.create({
      data: {
        plantId,
      },
    });

    revalidatePath("/");
  }

  const plants = await prisma.plant.findMany();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16">
      <h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-geist-sans)] text-[#333333]">
        A Seed! A Bud!
      </h1>
      <ul className="list-inside font-[family-name:var(--font-geist-sans)]">
        {plants.map((plant) => (
          <li key={plant.id} className="mb-2">
            <form action={waterPlant}>
              <Link href={{ pathname: "/plants/" + plant.id }}>
                {plant.name}
              </Link>
              <input type="hidden" name="plantId" value={plant.id}></input>
              <button
                type="submit"
                className="m-4 px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition duration-150"
              >
                Water
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}

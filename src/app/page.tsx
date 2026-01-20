import prisma from "@/../lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function Home() {
  async function waterPlant(formData: FormData) {
    "use server";

    const plantId = Number(formData.get("plantId"));
    const dateString = formData.get("date") as string;

    await prisma.event.create({
      data: {
        plantId,
        ...(dateString && { date: new Date(dateString) }),
      },
    });

    revalidatePath("/");
  }

  function getWateringColor(lastWatered: Date | null): string {
    if (!lastWatered) return "rgb(255, 255, 255)"; // white if never watered

    const daysSince = Math.floor(
      (new Date().getTime() - lastWatered.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Define your thresholds
    const maxDays = 20; // Fully white after 20 days

    if (daysSince >= maxDays) return "rgb(255, 255, 255)"; // white
    if (daysSince <= 0) return "rgb(34, 197, 94)"; // green-500

    // Interpolate from green to white
    const ratio = daysSince / maxDays;

    // Green (34, 197, 94) → White (255, 255, 255)
    const r = Math.round(34 + (255 - 34) * ratio);
    const g = Math.round(197 + (255 - 197) * ratio);
    const b = Math.round(94 + (255 - 94) * ratio);

    return `rgb(${r}, ${g}, ${b})`;
  }

  const plants = await prisma.plant.findMany({
    //orderBy: { index: { sort: "asc", nulls: "last" } },
    include: {
      events: {
        orderBy: { date: "desc" },
        take: 1,
        select: {
          date: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center mt-8">
      <h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-geist-sans)] text-[#333333]">
        A Seed! A Bud!
      </h1>
      <ul className="list-inside font-[family-name:var(--font-geist-sans)]">
        {plants.map((plant) => (
          <li key={plant.id} className="mb-2">
            <form action={waterPlant}>
              <div
                style={{
                  backgroundColor: getWateringColor(plant.events[0]?.date),
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                }}
              />
              <Link
                href={{ pathname: "/plants/" + plant.id }}
                className="font-semibold m-4"
              >
                {plant.name}
              </Link>
              <input type="hidden" name="plantId" value={plant.id}></input>
              <input type="date" name="date" className="m-4" />
              <button
                type="submit"
                className="m-4 px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition duration-150"
              >
                Water
              </button>
              <span>
                Last:{" "}
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }).format(plant.events[0]?.date)}
              </span>
            </form>
          </li>
        ))}
      </ul>
      <Link href={{ pathname: "/plants/new " }}>
        <button className="m-4 px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition duration-150">
          + Add new plant
        </button>
      </Link>
    </div>
  );
}

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const plantData = [
  {
    name: "Bird of Paradise",
    events: {
      create: [
        {
          date: new Date("01-19-2025"),
        },
      ],
    },
  },
];

export async function main() {
  for (const p of plantData) {
    await prisma.plant.create({ data: p });
  }
}

main();

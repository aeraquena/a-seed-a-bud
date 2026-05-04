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

const siteData = [
  {
    name: "Bedroom (Dresser)",
    index: 0,
  },
  {
    name: "Bedroom (Right Window)",
    index: 1,
  },
  {
    name: "Bedroom (Left Window)",
    index: 2,
  },
  {
    name: "Greenhouse (Shelf 1)",
    index: 3,
  },
  {
    name: "Greenhouse (Shelf 2)",
    index: 4,
  },
  {
    name: "Greenhouse (Shelf 3)",
    index: 5,
  },
  {
    name: "Living Room (Left Window)",
    index: 6,
  },
  {
    name: "Living Room (Right Window)",
    index: 7,
  },
  {
    name: "Living Room (Indirect)",
    index: 8,
  },
  {
    name: "Living Room (Shelf 4)",
    index: 9,
  },
  {
    name: "Living Room (Shelf 3)",
    index: 9,
  },
  {
    name: "Living Room (Shelf 2)",
    index: 10,
  },
  {
    name: "Living Room (Shelf 1)",
    index: 11,
  },
]

export async function main() {
  /*for (const p of plantData) {
    await prisma.plant.upsert({
      where: { name: s.name },
      update: { index: s.index },
      create: s,
    });
  }*/
  for (const s of siteData) {
    await prisma.site.upsert({
      where: { name: s.name },
      update: { index: s.index },
      create: s,
    });
  }
}

main();

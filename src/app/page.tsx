export const dynamic = 'force-dynamic'

import prisma from '@/../lib/prisma'
import Link from 'next/link'
import { PlantBoard } from '@/components/PlantBoard'
import { reorderPlants, waterPlant, undoWaterPlant } from '@/app/actions'

export default async function Home() {
  const sites = await prisma.site.findMany({
    orderBy: { index: 'asc' },
    include: {
      plants: {
        where: { alive: true },
        orderBy: { index: 'asc' },
        include: {
          events: {
            orderBy: { date: 'desc' },
            take: 1,
            select: {
              id: true,
              date: true,
            },
          },
        },
      },
    },
  })

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-white px-4 pt-8">
      <div className="font-(family-name:--font-geist-sans)">
        <PlantBoard
          initialSites={sites}
          reorderPlants={reorderPlants}
          waterPlant={waterPlant}
          undoWaterPlant={undoWaterPlant}
        />
      </div>
      <Link href={{ pathname: '/plants/new ' }}>
        <button className="m-4 rounded bg-green-600 px-4 py-2 font-semibold text-white transition duration-150 hover:bg-green-700">
          + Add new plant
        </button>
      </Link>
    </div>
  )
}

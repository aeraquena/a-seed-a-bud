import prisma from '@/../lib/prisma'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { PlantBoard } from '@/components/PlantBoard'
import { reorderPlants } from '@/app/actions'

export default async function Home() {
  async function waterPlant(formData: FormData) {
    'use server'

    const plantId = Number(formData.get('plantId'))
    const daysAgoStr = formData.get('daysAgo') as string
    const daysAgo = daysAgoStr !== '' ? Number(daysAgoStr) : null

    let date: Date | undefined
    if (daysAgo !== null && !isNaN(daysAgo)) {
      date = new Date()
      date.setDate(date.getDate() - daysAgo)
    }

    await prisma.event.create({
      data: {
        plantId,
        ...(date && { date }),
      },
    })

    revalidatePath('/')
  }

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
              date: true,
            },
          },
        },
      },
    },
  })

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 pt-8">
      <h1 className="mb-8 font-(family-name:--font-geist-sans) text-4xl font-bold text-[#333333]">
        A Seed! A Bud!
      </h1>
      <div className="font-(family-name:--font-geist-sans)">
        <PlantBoard
          initialSites={sites}
          reorderPlants={reorderPlants}
          waterPlant={waterPlant}
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

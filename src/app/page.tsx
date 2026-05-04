import prisma from '@/../lib/prisma'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export default async function Home() {
  async function waterPlant(formData: FormData) {
    'use server'

    const plantId = Number(formData.get('plantId'))
    const dateString = formData.get('date') as string

    await prisma.event.create({
      data: {
        plantId,
        ...(dateString && { date: new Date(dateString) }),
      },
    })

    revalidatePath('/')
  }

  function getWateringColor(lastWatered: Date | null): string {
    if (!lastWatered) return 'rgb(255, 255, 255)' // white if never watered

    const daysSince = Math.floor(
      (new Date().getTime() - lastWatered.getTime()) / (1000 * 60 * 60 * 24)
    )

    // Define your thresholds
    const maxDays = 20 // Fully white after 20 days

    if (daysSince >= maxDays) return 'rgb(255, 255, 255)' // white
    if (daysSince <= 0) return 'rgb(34, 197, 94)' // green-500

    // Interpolate from green to white
    const ratio = daysSince / maxDays

    // Green (34, 197, 94) → White (255, 255, 255)
    const r = Math.round(34 + (255 - 34) * ratio)
    const g = Math.round(197 + (255 - 197) * ratio)
    const b = Math.round(94 + (255 - 94) * ratio)

    return `rgb(${r}, ${g}, ${b})`
  }

  const sites = await prisma.site.findMany({
    orderBy: { index: 'asc' },
    include: {
      plants: {
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
      <ul className="list-inside font-(family-name:--font-geist-sans)">
        {sites.map((site) => (
          <div key={site.id}>
            <h2 className="mb-4 text-2xl font-bold">{site.name}</h2>
            {site.plants.map((plant) => (
              <li key={plant.id} className="mb-2">
                <form action={waterPlant}>
                  <div
                    style={{
                      backgroundColor: plant.events
                        ? getWateringColor(plant.events[0]?.date)
                        : '#ffffff',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      display: 'inline-block',
                    }}
                  />
                  <Link
                    href={{ pathname: '/plants/' + plant.id }}
                    className="m-4 font-semibold"
                  >
                    <div className="inline-block w-64">{plant.name}</div>
                  </Link>
                  <input type="hidden" name="plantId" value={plant.id}></input>
                  <input type="date" name="date" className="m-4" />
                  <button
                    type="submit"
                    className="m-4 rounded bg-green-600 px-4 py-2 font-semibold text-white transition duration-150 hover:bg-green-700"
                  >
                    Water
                  </button>
                  <span>
                    Last:{' '}
                    {plant.events
                      ? new Intl.DateTimeFormat('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        }).format(plant.events[0]?.date)
                      : 'Never'}
                  </span>
                </form>
              </li>
            ))}
          </div>
        ))}
      </ul>
      <Link href={{ pathname: '/plants/new ' }}>
        <button className="m-4 rounded bg-green-600 px-4 py-2 font-semibold text-white transition duration-150 hover:bg-green-700">
          + Add new plant
        </button>
      </Link>
    </div>
  )
}

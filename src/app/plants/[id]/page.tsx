import prisma from '@/../lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { updatePlantHealth } from '@/app/actions'
import { HealthSelect } from '@/components/HealthSelect'

export default async function Post({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const plant = await prisma.plant.findUnique({
    where: { id: parseInt(id) },
    include: {
      events: {
        orderBy: { date: 'desc' },
      },
      site: true,
    },
  })

  if (!plant) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 pt-8">
      <h1 className="mb-8 px-4 text-center text-4xl font-bold text-[#333333]">
        {plant.name}
      </h1>
      <Link
        href={`/plants/${plant.id}/edit`}
        className="bg-brand-green hover:bg-brand-green-hover mb-8 rounded-lg px-4 py-2 text-white"
      >
        Edit Plant
      </Link>
      <div className="mx-auto w-full max-w-98.25 px-4 text-left">
        <p className="flex items-center justify-between gap-2">
          <strong>Health</strong>
          <HealthSelect
            plantId={plant.id}
            health={plant.health}
            updatePlantHealth={updatePlantHealth}
          />
        </p>
        {plant.site && (
          <p className="mt-2 flex items-center justify-between gap-2">
            <strong>Site</strong>
            <span>{plant.site.name}</span>
          </p>
        )}
        {plant.propagation && (
          <p className="mt-2 flex items-center justify-between gap-2">
            <strong>Propagation</strong>
            <span>Yes</span>
          </p>
        )}
        {!plant.alive && (
          <p className="flex items-center justify-between gap-2">
            <strong>Dead</strong>
            <span>Yes</span>
          </p>
        )}

        <p className="mt-2 flex items-center justify-between gap-2">
          <strong>Created</strong>
          <span>
            {new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            }).format(plant.createdAt)}
          </span>
        </p>
        <p className="mt-2 flex items-center justify-between gap-2">
          <strong>Updated</strong>
          <span>
            {new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            }).format(plant.updatedAt)}
          </span>
        </p>
        <h2 className="m-8 text-center text-2xl font-bold text-[#333333]">
          Waterings
        </h2>
        <ul className="list-inside font-[family-name:var(--font-geist-sans)]">
          {plant.events.map((event) => (
            <li key={event.id} className="mb-2">
              {new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              }).format(event.date)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

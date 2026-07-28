import prisma from '@/../lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

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
    },
  })

  if (!plant) {
    notFound()
  }

  return (
    <div className="-mt-16 flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <h1 className="mb-8 text-4xl font-bold text-[#333333]">{plant.name}</h1>
      <Link
        href={`/plants/${plant.id}/edit`}
        className="mb-8 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        Edit Plant
      </Link>
      <p>
        Created on{' '}
        {new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).format(plant.createdAt)}
      </p>
      <p>
        Updated on{' '}
        {new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).format(plant.updatedAt)}
      </p>
      <h2 className="m-8 text-2xl font-bold text-[#333333]">Waterings</h2>
      <ul className="list-inside font-[family-name:var(--font-geist-sans)]">
        {plant.events.map((event) => (
          <li key={event.id} className="mb-2">
            {new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }).format(event.date)}
          </li>
        ))}
      </ul>
    </div>
  )
}

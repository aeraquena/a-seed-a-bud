'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Link from 'next/link'
import type { PlantWithEvents } from '@/lib/types'
import { daysAgo, getWateringColor } from '@/lib/utils'

type Props = {
  plant: PlantWithEvents
  waterPlant: (formData: FormData) => Promise<void>
}

export function SortablePlantRow({ plant, waterPlant }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: plant.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <li ref={setNodeRef} style={style} className="mb-2 flex items-center">
      <span
        {...attributes}
        {...listeners}
        className="mr-2 cursor-grab touch-none select-none text-gray-400 active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        ⠿
      </span>
      <form action={waterPlant} className="flex items-center">
        <div
          style={{
            backgroundColor: plant.events
              ? getWateringColor(plant.events[0]?.date ?? null)
              : '#ffffff',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
        <Link
          href={{ pathname: '/plants/' + plant.id }}
          className="m-4 font-semibold"
        >
          <div className="inline-block w-64">{plant.name}</div>
        </Link>
        <input type="hidden" name="plantId" value={plant.id} />
        <input type="date" name="date" className="m-4" />
        <button
          type="submit"
          className="m-4 rounded bg-green-600 px-4 py-2 font-semibold text-white transition duration-150 hover:bg-green-700"
        >
          Water
        </button>
        <span>
          Last:{' '}
          {plant.events[0]
            ? `${daysAgo(plant.events[0].date)} days ago`
            : 'Never'}
        </span>
      </form>
    </li>
  )
}

'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Link from 'next/link'
import type { PlantWithEvents } from '@/lib/types'
import { daysAgo, getWateringColor } from '@/lib/utils'
import { Droplet } from 'lucide-react'

type Props = {
  plant: PlantWithEvents
  waterPlant: (formData: FormData) => Promise<void>
}

export function SortablePlantRow({ plant, waterPlant }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: plant.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <li ref={setNodeRef} style={style} className="mb-2 flex w-96 select-none">
      <span
        {...attributes}
        {...listeners}
        className="mr-2 flex cursor-grab touch-none items-center text-gray-400 select-none active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        ⠿
      </span>
      <form
        action={waterPlant}
        className="flex flex-1 items-center justify-between gap-2"
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div
            style={{
              backgroundColor: plant.events
                ? getWateringColor(plant.events[0]?.date ?? null)
                : '#ffffff',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              flexShrink: 0,
            }}
          />
          <Link
            href={{ pathname: '/plants/' + plant.id }}
            className="min-w-0 py-1"
          >
            <div className="font-semibold wrap-break-word">{plant.name}</div>
            <div>
              <em>
                {plant.events[0]
                  ? `${daysAgo(plant.events[0].date)} days ago`
                  : 'Never'}
              </em>
            </div>
          </Link>
        </div>
        <input type="hidden" name="plantId" value={plant.id} />
        {/* <input type="number" name="daysAgo" min="0" placeholder="days ago" className="m-4 w-24 rounded border px-2 py-1" /> */}
        <button
          type="submit"
          className="shrink-0 flex items-center justify-center rounded-full bg-green-600 p-2 text-white transition duration-150 hover:bg-green-700"
        >
          <Droplet color="white" size={24} />
        </button>
      </form>
    </li>
  )
}

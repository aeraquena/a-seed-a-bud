'use client'

import { useState } from 'react'
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
  const [wateredToday, setWateredToday] = useState(
    plant.events[0] ? daysAgo(plant.events[0].date) === 0 : false
  )

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

  const daysAgoWatered = plant.events[0] ? daysAgo(plant.events[0].date) : 0

  return (
    <li ref={setNodeRef} style={style} className="mb-2 flex w-84 select-none">
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
        onSubmit={() => setWateredToday(true)}
        className="flex flex-1 items-center justify-between gap-2"
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div
            style={{
              backgroundColor: wateredToday
                ? getWateringColor(new Date())
                : getWateringColor(plant.events[0]?.date ?? null),
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
                {wateredToday
                  ? 'Today'
                  : plant.events[0]
                    ? `${daysAgoWatered} day${daysAgoWatered > 1 ? `s` : ``} ago`
                    : 'Never'}
              </em>
            </div>
          </Link>
        </div>
        <input type="hidden" name="plantId" value={plant.id} />
        {/* <input type="number" name="daysAgo" min="0" placeholder="days ago" className="m-4 w-24 rounded border px-2 py-1" /> */}
        <button
          type="submit"
          disabled={wateredToday}
          className={`flex shrink-0 items-center justify-center rounded-full p-2 transition duration-150 ${wateredToday ? 'cursor-not-allowed bg-gray-300' : 'bg-green-600 hover:bg-green-700'}`}
        >
          <Droplet color="white" size={24} />
        </button>
      </form>
    </li>
  )
}

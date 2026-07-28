'use client'

import { useState, useTransition } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Link from 'next/link'
import type { PlantWithEvents } from '@/lib/types'
import { daysAgo, getWateringColor } from '@/lib/utils'
import { Droplet, RotateCcw } from 'lucide-react'

type Props = {
  plant: PlantWithEvents
  waterPlant: (plantId: number) => Promise<{ eventId: number }>
  undoWaterPlant: (eventId: number) => Promise<void>
}

export function SortablePlantRow({ plant, waterPlant, undoWaterPlant }: Props) {
  const latestEvent = plant.events[0]
  const [todayEventId, setTodayEventId] = useState<number | null>(
    latestEvent && daysAgo(latestEvent.date) === 0 ? latestEvent.id : null
  )
  const [isPending, startTransition] = useTransition()
  const wateredToday = todayEventId !== null

  function handleClick() {
    startTransition(async () => {
      if (todayEventId !== null) {
        const eventId = todayEventId
        setTodayEventId(null)
        await undoWaterPlant(eventId)
      } else {
        const { eventId } = await waterPlant(plant.id)
        setTodayEventId(eventId)
      }
    })
  }

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
  const hideWaterButton = plant.propagation && plant.substrate === 'WATER'

  return (
    <li ref={setNodeRef} style={style} className="mb-2 flex w-84 select-none">
      <span
        {...attributes}
        {...listeners}
        suppressHydrationWarning
        className="mr-2 flex cursor-grab touch-none items-center text-gray-400 select-none active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        ⠿
      </span>
      <div className="flex flex-1 items-center justify-between gap-2">
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
        {!hideWaterButton && (
          <button
            type="button"
            onClick={handleClick}
            disabled={isPending}
            className={`flex shrink-0 cursor-pointer items-center justify-center rounded-full p-2 transition duration-150 disabled:cursor-not-allowed disabled:opacity-70 ${wateredToday ? 'bg-gray-400 hover:bg-gray-500' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {wateredToday ? (
              <RotateCcw color="white" size={24} />
            ) : (
              <Droplet color="white" size={24} />
            )}
          </button>
        )}
      </div>
    </li>
  )
}

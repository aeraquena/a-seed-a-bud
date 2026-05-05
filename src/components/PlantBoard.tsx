'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { SortablePlantRow } from './SortablePlantRow'
import type { PlantWithEvents, SiteWithPlants } from '@/lib/types'
import type { PlantUpdate } from '@/app/actions'

function normalizeSite(site: SiteWithPlants): SiteWithPlants {
  return {
    ...site,
    plants: [...site.plants].sort((a, b) => {
      if (a.index == null && b.index == null) return 0
      if (a.index == null) return 1
      if (b.index == null) return -1
      return a.index - b.index
    }),
  }
}

function SiteDropZone({
  site,
  waterPlant,
}: {
  site: SiteWithPlants
  waterPlant: (formData: FormData) => Promise<void>
}) {
  const { setNodeRef } = useDroppable({ id: `site-${site.id}` })

  return (
    <div ref={setNodeRef} className="my-8">
      <h2 className="mb-4 text-2xl font-bold">{site.name}</h2>
      <SortableContext
        items={site.plants.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="list-inside min-h-[2rem]">
          {site.plants.map((plant) => (
            <SortablePlantRow key={plant.id} plant={plant} waterPlant={waterPlant} />
          ))}
        </ul>
      </SortableContext>
    </div>
  )
}

type Props = {
  initialSites: SiteWithPlants[]
  reorderPlants: (updates: PlantUpdate[]) => Promise<void>
  waterPlant: (formData: FormData) => Promise<void>
}

export function PlantBoard({ initialSites, reorderPlants, waterPlant }: Props) {
  const [sites, setSites] = useState<SiteWithPlants[]>(() =>
    initialSites.map(normalizeSite)
  )
  const [activePlant, setActivePlant] = useState<PlantWithEvents | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function findSiteForPlant(plantId: number): SiteWithPlants | undefined {
    return sites.find((s) => s.plants.some((p) => p.id === plantId))
  }

  function findSiteForDroppable(overId: string | number): SiteWithPlants | undefined {
    // overId is either a plant id (number) or a site droppable id ("site-{id}")
    if (typeof overId === 'string' && overId.startsWith('site-')) {
      const siteId = parseInt(overId.replace('site-', ''))
      return sites.find((s) => s.id === siteId)
    }
    return findSiteForPlant(overId as number)
  }

  function handleDragStart(event: DragStartEvent) {
    const plant = sites
      .flatMap((s) => s.plants)
      .find((p) => p.id === event.active.id)
    setActivePlant(plant ?? null)
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActivePlant(null)
    if (!over || active.id === over.id) return

    const activeSite = findSiteForPlant(active.id as number)
    const overSite = findSiteForDroppable(over.id)

    if (!activeSite || !overSite) return

    const prevSites = sites
    let newSites: SiteWithPlants[]

    if (activeSite.id === overSite.id) {
      // Same site — reorder within
      const oldIdx = activeSite.plants.findIndex((p) => p.id === active.id)
      const newIdx = activeSite.plants.findIndex((p) => p.id === over.id)
      if (oldIdx === newIdx) return

      const reordered = arrayMove(activeSite.plants, oldIdx, newIdx)
      newSites = sites.map((s) =>
        s.id === activeSite.id ? { ...s, plants: reordered } : s
      )
    } else {
      // Cross-site move
      const plant = activeSite.plants.find((p) => p.id === active.id)!
      const updatedPlant = { ...plant, siteId: overSite.id }

      const sourcePlants = activeSite.plants.filter((p) => p.id !== active.id)

      let destPlants: PlantWithEvents[]
      if (typeof over.id === 'string' && over.id.startsWith('site-')) {
        // Dropped on empty zone — append at end
        destPlants = [...overSite.plants, updatedPlant]
      } else {
        // Dropped on a plant — insert before/after it
        const overIdx = overSite.plants.findIndex((p) => p.id === over.id)
        destPlants = [...overSite.plants]
        destPlants.splice(overIdx, 0, updatedPlant)
      }

      newSites = sites.map((s) => {
        if (s.id === activeSite.id) return { ...s, plants: sourcePlants }
        if (s.id === overSite.id) return { ...s, plants: destPlants }
        return s
      })
    }

    setSites(newSites)

    // Build updates for all affected sites (reassign all indices to stay contiguous)
    const affectedSiteIds = new Set([activeSite.id, overSite.id])
    const updates: PlantUpdate[] = newSites
      .filter((s) => affectedSiteIds.has(s.id))
      .flatMap((s) =>
        s.plants.map((p, i) => {
          const update: PlantUpdate = { id: p.id, index: i + 1 }
          // Include siteId only if the plant moved to a new site
          if (p.siteId !== s.id) update.siteId = s.id
          return update
        })
      )

    try {
      await reorderPlants(updates)
    } catch {
      setSites(prevSites)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToWindowEdges]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {sites.map((site) => (
        <SiteDropZone key={site.id} site={site} waterPlant={waterPlant} />
      ))}
      <DragOverlay>
        {activePlant ? (
          <div className="rounded bg-white shadow-lg opacity-90 px-2">
            <span className="font-semibold">{activePlant.name}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

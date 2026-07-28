'use client'

import { useState } from 'react'
import { Fragment } from 'react'
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
  type DragOverEvent,
  type UniqueIdentifier,
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

function DropLine() {
  return <div className="mx-2 h-0.5 rounded bg-green-600" />
}

function SiteDropZone({
  site,
  activeId,
  activeSiteId,
  overId,
  waterPlant,
  undoWaterPlant,
}: {
  site: SiteWithPlants
  activeId: UniqueIdentifier | null
  activeSiteId: number | null
  overId: UniqueIdentifier | null
  waterPlant: (plantId: number) => Promise<{ eventId: number }>
  undoWaterPlant: (eventId: number) => Promise<void>
}) {
  const { setNodeRef } = useDroppable({ id: `site-${site.id}` })

  const isCrossSite = activeSiteId !== null && activeSiteId !== site.id
  const activeIndexInSite = site.plants.findIndex((p) => p.id === activeId)
  const showEndLine =
    activeId !== null &&
    overId === `site-${site.id}` &&
    site.plants.every((p) => p.id !== activeId)

  return (
    <div ref={setNodeRef} className="mb-8">
      <h2 className="mb-4 text-2xl font-bold">{site.name}</h2>
      <SortableContext
        items={site.plants.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="min-h-[2rem] list-inside pb-4">
          {site.plants.map((plant, index) => {
            const isOver = plant.id === overId
            let showAbove = false
            let showBelow = false

            if (isOver && activeId !== null && activeId !== plant.id) {
              if (isCrossSite || activeIndexInSite === -1) {
                // Cross-site: insert before the over item
                showAbove = true
              } else if (activeIndexInSite > index) {
                // Dragging up within same site: insert before
                showAbove = true
              } else {
                // Dragging down within same site: insert after
                showBelow = true
              }
            }

            return (
              <Fragment key={plant.id}>
                {showAbove && <DropLine />}
                <SortablePlantRow
                  plant={plant}
                  waterPlant={waterPlant}
                  undoWaterPlant={undoWaterPlant}
                />
                {showBelow && <DropLine />}
              </Fragment>
            )
          })}
          {showEndLine && <DropLine />}
        </ul>
      </SortableContext>
    </div>
  )
}

type Props = {
  initialSites: SiteWithPlants[]
  reorderPlants: (updates: PlantUpdate[]) => Promise<void>
  waterPlant: (plantId: number) => Promise<{ eventId: number }>
  undoWaterPlant: (eventId: number) => Promise<void>
}

export function PlantBoard({
  initialSites,
  reorderPlants,
  waterPlant,
  undoWaterPlant,
}: Props) {
  const [sites, setSites] = useState<SiteWithPlants[]>(() =>
    initialSites.map(normalizeSite)
  )
  const [activePlant, setActivePlant] = useState<PlantWithEvents | null>(null)
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [activeSiteId, setActiveSiteId] = useState<number | null>(null)
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function findSiteForPlant(plantId: number): SiteWithPlants | undefined {
    return sites.find((s) => s.plants.some((p) => p.id === plantId))
  }

  function findSiteForDroppable(
    id: UniqueIdentifier
  ): SiteWithPlants | undefined {
    if (typeof id === 'string' && id.startsWith('site-')) {
      const siteId = parseInt(id.replace('site-', ''))
      return sites.find((s) => s.id === siteId)
    }
    return findSiteForPlant(id as number)
  }

  function handleDragStart(event: DragStartEvent) {
    const plant = sites
      .flatMap((s) => s.plants)
      .find((p) => p.id === event.active.id)
    const site = findSiteForPlant(event.active.id as number)
    setActivePlant(plant ?? null)
    setActiveId(event.active.id)
    setActiveSiteId(site?.id ?? null)
  }

  function handleDragOver(event: DragOverEvent) {
    setOverId(event.over?.id ?? null)
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActivePlant(null)
    setActiveId(null)
    setActiveSiteId(null)
    setOverId(null)
    if (!over || active.id === over.id) return

    const activeSite = findSiteForPlant(active.id as number)
    const overSite = findSiteForDroppable(over.id)

    if (!activeSite || !overSite) return

    const prevSites = sites
    let newSites: SiteWithPlants[]

    if (activeSite.id === overSite.id) {
      const oldIdx = activeSite.plants.findIndex((p) => p.id === active.id)
      const newIdx = activeSite.plants.findIndex((p) => p.id === over.id)
      if (oldIdx === newIdx) return

      const reordered = arrayMove(activeSite.plants, oldIdx, newIdx)
      newSites = sites.map((s) =>
        s.id === activeSite.id ? { ...s, plants: reordered } : s
      )
    } else {
      const plant = activeSite.plants.find((p) => p.id === active.id)!
      const updatedPlant = { ...plant, siteId: overSite.id }
      const sourcePlants = activeSite.plants.filter((p) => p.id !== active.id)

      let destPlants: PlantWithEvents[]
      if (typeof over.id === 'string' && over.id.startsWith('site-')) {
        destPlants = [...overSite.plants, updatedPlant]
      } else {
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

    const affectedSiteIds = new Set([activeSite.id, overSite.id])
    const updates: PlantUpdate[] = newSites
      .filter((s) => affectedSiteIds.has(s.id))
      .flatMap((s) =>
        s.plants.map((p, i) => ({ id: p.id, index: i + 1, siteId: s.id }))
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
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {sites.map((site) => (
        <SiteDropZone
          key={site.id}
          site={site}
          activeId={activeId}
          activeSiteId={activeSiteId}
          overId={overId}
          waterPlant={waterPlant}
          undoWaterPlant={undoWaterPlant}
        />
      ))}
      <DragOverlay>
        {activePlant ? (
          <div className="rounded bg-white px-2 opacity-90 shadow-lg">
            <span className="font-semibold">{activePlant.name}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

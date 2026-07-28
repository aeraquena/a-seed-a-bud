'use server'

import prisma from '@/../lib/prisma'
import { revalidatePath } from 'next/cache'

export type PlantUpdate = { id: number; index: number; siteId?: number }

export async function reorderPlants(updates: PlantUpdate[]): Promise<void> {
  if (updates.length === 0) return
  await prisma.$transaction(
    updates.map(({ id, index, siteId }) =>
      prisma.plant.update({
        where: { id },
        data: { index, ...(siteId !== undefined && { siteId }) },
      })
    )
  )
  revalidatePath('/')
}

export async function waterPlant(
  plantId: number
): Promise<{ eventId: number }> {
  const event = await prisma.event.create({ data: { plantId } })
  revalidatePath('/')
  return { eventId: event.id }
}

export async function undoWaterPlant(eventId: number): Promise<void> {
  await prisma.event.delete({ where: { id: eventId } })
  revalidatePath('/')
}

export async function updatePlantHealth(
  plantId: number,
  health: number | null
): Promise<void> {
  await prisma.plant.update({ where: { id: plantId }, data: { health } })
  revalidatePath('/')
  revalidatePath(`/plants/${plantId}`)
}

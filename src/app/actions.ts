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

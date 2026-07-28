import { Prisma, PotMaterial, Substrate } from '../../generated/prisma/client'

export function parsePlantFormData(formData: FormData): Prisma.PlantUncheckedCreateInput {
  const name = formData.get('name') as string
  const siteId = formData.get('siteId') as string
  const speciesId = formData.get('speciesId') as string
  const health = formData.get('health') as string
  const potSize = formData.get('potSize') as string
  const potMaterial = formData.get('potMaterial') as string
  const substrate = formData.get('substrate') as string
  const source = formData.get('source') as string
  const dateAcquired = formData.get('dateAcquired') as string
  const cost = formData.get('cost') as string

  return {
    name,
    siteId: siteId ? Number(siteId) : null,
    speciesId: speciesId ? Number(speciesId) : null,
    health: health ? Number(health) : null,
    propagation: formData.get('propagation') === 'on',
    potSize: potSize ? Number(potSize) : null,
    potMaterial: potMaterial ? (potMaterial as PotMaterial) : null,
    substrate: substrate ? (substrate as Substrate) : null,
    source: source || null,
    dateAcquired: dateAcquired ? new Date(dateAcquired) : null,
    cost: cost ? Number(cost) : null,
    alive: formData.get('alive') === 'on',
  }
}

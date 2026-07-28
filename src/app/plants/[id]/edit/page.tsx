import prisma from '@/../lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect, notFound } from 'next/navigation'
import { parsePlantFormData } from '@/lib/plantForm'
import PlantForm from '@/components/PlantForm'

export default async function EditPlant({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const plantId = parseInt(id)

  const [plant, sites, species] = await Promise.all([
    prisma.plant.findUnique({ where: { id: plantId } }),
    prisma.site.findMany({ orderBy: { name: 'asc' } }),
    prisma.species.findMany({ orderBy: { common_name: 'asc' } }),
  ])

  if (!plant) {
    notFound()
  }

  async function updatePlant(formData: FormData) {
    'use server'

    await prisma.plant.update({
      where: { id: plantId },
      data: parsePlantFormData(formData),
    })

    revalidatePath('/')
    revalidatePath(`/plants/${plantId}`)
    redirect(`/plants/${plantId}`)
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-6 text-center text-2xl font-bold">Edit Plant</h1>
      <PlantForm
        sites={sites}
        species={species}
        action={updatePlant}
        defaultValues={plant}
        submitLabel="Save Changes"
      />
    </div>
  )
}

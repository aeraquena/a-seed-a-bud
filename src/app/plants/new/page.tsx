import prisma from '@/../lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { parsePlantFormData } from '@/lib/plantForm'
import PlantForm from '@/components/PlantForm'

export default async function NewPlant() {
  const [sites, species] = await Promise.all([
    prisma.site.findMany({ orderBy: { name: 'asc' } }),
    prisma.species.findMany({ orderBy: { common_name: 'asc' } }),
  ])

  async function createPlant(formData: FormData) {
    'use server'

    await prisma.plant.create({
      data: parsePlantFormData(formData),
    })

    revalidatePath('/')
    redirect('/')
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-6 text-2xl font-bold">Add New Plant</h1>
      <PlantForm
        sites={sites}
        species={species}
        action={createPlant}
        submitLabel="Create Plant"
      />
    </div>
  )
}

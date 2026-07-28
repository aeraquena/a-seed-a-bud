import Form from 'next/form'
import prisma from '@/../lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { PotMaterial, Substrate } from '../../../../generated/prisma/client'

export default async function NewPlant() {
  const [sites, species] = await Promise.all([
    prisma.site.findMany({ orderBy: { name: 'asc' } }),
    prisma.species.findMany({ orderBy: { common_name: 'asc' } }),
  ])

  async function createPlant(formData: FormData) {
    'use server'

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

    await prisma.plant.create({
      data: {
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
      },
    })

    revalidatePath('/')
    redirect('/')
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-6 text-2xl font-bold">Add New Plant</h1>
      <Form action={createPlant} className="space-y-6">
        <div>
          <label htmlFor="name" className="mb-2 block text-lg">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your plant name"
            className="w-full rounded-lg border px-4 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="siteId" className="mb-2 block text-lg">
            Site
          </label>
          <select
            id="siteId"
            name="siteId"
            className="w-full rounded-lg border px-4 py-2"
          >
            <option value="">None</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="speciesId" className="mb-2 block text-lg">
            Species
          </label>
          <select
            id="speciesId"
            name="speciesId"
            className="w-full rounded-lg border px-4 py-2"
          >
            <option value="">None</option>
            {species.map((s) => (
              <option key={s.id} value={s.id}>
                {s.common_name} ({s.scientific_name})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="health" className="mb-2 block text-lg">
            Health
          </label>
          <input
            type="number"
            id="health"
            name="health"
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div>
          <label htmlFor="potSize" className="mb-2 block text-lg">
            Pot Size
          </label>
          <input
            type="number"
            id="potSize"
            name="potSize"
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div>
          <label htmlFor="potMaterial" className="mb-2 block text-lg">
            Pot Material
          </label>
          <select
            id="potMaterial"
            name="potMaterial"
            className="w-full rounded-lg border px-4 py-2"
          >
            <option value="">None</option>
            {Object.values(PotMaterial).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="substrate" className="mb-2 block text-lg">
            Substrate
          </label>
          <select
            id="substrate"
            name="substrate"
            className="w-full rounded-lg border px-4 py-2"
          >
            <option value="">None</option>
            {Object.values(Substrate).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="source" className="mb-2 block text-lg">
            Source
          </label>
          <input
            type="text"
            id="source"
            name="source"
            placeholder="Where did this plant come from?"
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div>
          <label htmlFor="dateAcquired" className="mb-2 block text-lg">
            Date Acquired
          </label>
          <input
            type="date"
            id="dateAcquired"
            name="dateAcquired"
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div>
          <label htmlFor="cost" className="mb-2 block text-lg">
            Cost
          </label>
          <input
            type="number"
            id="cost"
            name="cost"
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="propagation"
            name="propagation"
            className="h-5 w-5"
          />
          <label htmlFor="propagation" className="text-lg">
            Propagation
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="alive"
            name="alive"
            defaultChecked
            className="h-5 w-5"
          />
          <label htmlFor="alive" className="text-lg">
            Alive
          </label>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-green-600 py-3 text-white hover:bg-green-700"
        >
          Create Plant
        </button>
      </Form>
    </div>
  )
}

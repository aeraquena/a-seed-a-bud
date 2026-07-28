import Form from 'next/form'
import { PotMaterial, Substrate, Plant, Site, Species } from '../../generated/prisma/client'
import { HEALTH_LABELS, healthValueToLabel } from '@/lib/health'

export default function PlantForm({
  sites,
  species,
  action,
  defaultValues,
  submitLabel,
}: {
  sites: Site[]
  species: Species[]
  action: (formData: FormData) => Promise<void>
  defaultValues?: Plant
  submitLabel: string
}) {
  const dateAcquired = defaultValues?.dateAcquired
    ? defaultValues.dateAcquired.toISOString().slice(0, 10)
    : ''

  return (
    <Form action={action} className="space-y-6">
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
          defaultValue={defaultValues?.name ?? ''}
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
          defaultValue={defaultValues?.siteId ?? ''}
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
          defaultValue={defaultValues?.speciesId ?? ''}
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
        <select
          id="health"
          name="health"
          className="w-full rounded-lg border px-4 py-2"
          defaultValue={healthValueToLabel(defaultValues?.health)}
        >
          <option value="">None</option>
          {Object.keys(HEALTH_LABELS).map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
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
          defaultValue={defaultValues?.potSize ?? ''}
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
          defaultValue={defaultValues?.potMaterial ?? ''}
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
          defaultValue={defaultValues?.substrate ?? ''}
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
          defaultValue={defaultValues?.source ?? ''}
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
          defaultValue={dateAcquired}
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
          defaultValue={defaultValues?.cost ?? ''}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="propagation"
          name="propagation"
          className="h-5 w-5"
          defaultChecked={defaultValues?.propagation ?? false}
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
          className="h-5 w-5"
          defaultChecked={defaultValues?.alive ?? true}
        />
        <label htmlFor="alive" className="text-lg">
          Alive
        </label>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-brand-green py-3 text-white hover:bg-brand-green-hover"
      >
        {submitLabel}
      </button>
    </Form>
  )
}

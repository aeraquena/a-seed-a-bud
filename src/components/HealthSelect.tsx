'use client'

import { useState, useTransition } from 'react'
import { HEALTH_LABELS } from '@/lib/health'

export function HealthSelect({
  plantId,
  health,
  updatePlantHealth,
}: {
  plantId: number
  health: number | null
  updatePlantHealth: (plantId: number, health: number | null) => Promise<void>
}) {
  const [value, setValue] = useState<number | null>(health)
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value ? Number(e.target.value) : null
    setValue(next)
    startTransition(async () => {
      await updatePlantHealth(plantId, next)
    })
  }

  return (
    <select
      value={value ?? ''}
      onChange={handleChange}
      disabled={isPending}
      className="rounded-lg border px-2 py-1 disabled:opacity-70"
    >
      <option value="">None</option>
      {Object.entries(HEALTH_LABELS).map(([label, val]) => (
        <option key={label} value={val}>
          {label}
        </option>
      ))}
    </select>
  )
}

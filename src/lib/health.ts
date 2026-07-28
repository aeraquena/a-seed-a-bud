export const HEALTH_LABELS: Record<string, number> = {
  Great: 4,
  Good: 3,
  Fair: 2,
  Poor: 1,
}

export function healthValueToLabel(value: number | null | undefined): string {
  if (value == null) return ''
  const entry = Object.entries(HEALTH_LABELS).find(([, v]) => v === value)
  return entry ? entry[0] : ''
}

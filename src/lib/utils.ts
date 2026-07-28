import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function daysAgo(lastWatered: Date): number {
  const toETCalendarDate = (d: Date) => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: 'numeric',
    }).formatToParts(d)
    const y = Number(parts.find((p) => p.type === 'year')!.value)
    const m = Number(parts.find((p) => p.type === 'month')!.value)
    const day = Number(parts.find((p) => p.type === 'day')!.value)
    return new Date(y, m - 1, day)
  }

  const today = toETCalendarDate(new Date())
  const watered = toETCalendarDate(lastWatered)
  return Math.round(
    (today.getTime() - watered.getTime()) / (1000 * 60 * 60 * 24)
  )
}

export function getWateringColor(lastWatered: Date | null): string {
  if (!lastWatered) return 'rgb(235, 235, 235)'

  const daysSince = daysAgo(lastWatered)
  const maxDays = 21

  if (daysSince >= maxDays) return 'rgb(235, 235, 235)'
  if (daysSince <= 0) return 'rgb(34, 197, 94)'

  const ratio = daysSince / maxDays
  const r = Math.round(34 + (235 - 34) * ratio)
  const g = Math.round(197 + (235 - 197) * ratio)
  const b = Math.round(94 + (235 - 94) * ratio)

  return `rgb(${r}, ${g}, ${b})`
}

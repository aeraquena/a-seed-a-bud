import type { Plant, Event, Site } from '../../generated/prisma/client'

export type PlantWithEvents = Plant & { events: Pick<Event, 'id' | 'date'>[] }
export type SiteWithPlants = Site & { plants: PlantWithEvents[] }

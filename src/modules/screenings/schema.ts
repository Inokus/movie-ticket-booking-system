import { z } from 'zod'
import type { Screenings } from '@/database'

type Record = Screenings

const schema = z.object({
  id: z.coerce.number().int().positive(),
  totalTickets: z.coerce.number().int().positive(),
  remainingTickets: z.coerce.number().int().nonnegative(),
  timestamp: z.string().datetime(),
  movieId: z.number().int().positive(),
})

const insertable = schema.omit({
  id: true,
  remainingTickets: true,
})

export const parse = (record: unknown) => schema.parse(record)
export const parseId = (id: unknown) => schema.shape.id.parse(id)
export const parseInsertable = (record: unknown) => insertable.parse(record)

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]

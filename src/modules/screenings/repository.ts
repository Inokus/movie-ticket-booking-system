import type { Insertable, Selectable } from 'kysely'
import type { Database, Screenings } from '@/database'
import { keys } from './schema'

const TABLE = 'screenings'
type Row = Screenings
type RowWithoutId = Omit<Row, 'id'>
type RowWithoutIdAndRemainingTickets = Omit<RowWithoutId, 'remainingTickets'>
type RowInsert = Insertable<RowWithoutIdAndRemainingTickets>

export default (db: Database) => ({
  findAllAvailable: async () => {
    return db
      .selectFrom(TABLE)
      .innerJoin('movies', 'movieId', 'movies.id')
      .select([
        'totalTickets',
        'remainingTickets',
        'timestamp',
        'title',
        'year',
      ])
      .where('remainingTickets', '>', 0)
      .execute()
  },

  create: async (record: RowInsert) => {
    const { totalTickets, ...insertable } = record
    const remainingTickets = totalTickets

    const recordWithRemaining = {
      totalTickets,
      remainingTickets,
      ...insertable,
    }

    return db
      .insertInto(TABLE)
      .values(recordWithRemaining)
      .returning(keys)
      .executeTakeFirst()
  },

  remove: async (id: number) => {
    return db
      .deleteFrom(TABLE)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst()
  },
})

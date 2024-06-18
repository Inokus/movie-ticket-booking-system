import { Kysely, SqliteDatabase } from 'kysely'

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('screenings')
    .ifNotExists()
    .addColumn('id', 'integer', (col) =>
      col.primaryKey().autoIncrement().notNull()
    )
    .addColumn('total_tickets', 'integer', (col) => col.notNull())
    .addColumn('remaining_tickets', 'integer', (col) => col.notNull())
    .addColumn('timestamp', 'datetime', (col) => col.notNull())
    .addColumn('movie_id', 'integer', (col) =>
      col.references('movies.id').notNull()
    )
    .execute()
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('screenings').execute()
}

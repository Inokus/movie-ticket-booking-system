import { Kysely, SqliteDatabase, sql } from 'kysely'

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('tickets')
    .ifNotExists()
    .addColumn('id', 'integer', (col) =>
      col.primaryKey().autoIncrement().notNull()
    )
    .addColumn('user_id', 'integer', (col) => col.notNull())
    .addColumn('timestamp', 'datetime', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('screening_id', 'integer', (col) =>
      col.references('screenings.id').notNull()
    )
    .execute()
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('tickets').execute()
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "articles_slug_idx";
  DROP INDEX "legal_texts_slug_idx";
  CREATE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "legal_texts_slug_idx" ON "legal_texts" USING btree ("slug");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "articles_slug_idx";
  DROP INDEX "legal_texts_slug_idx";
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE UNIQUE INDEX "legal_texts_slug_idx" ON "legal_texts" USING btree ("slug");`)
}

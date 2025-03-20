import 'src/config/index'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { db } from 'src/data/drizzle/config/orm'

await migrate(db, { migrationsFolder: './src/data/drizzle/migrations' })
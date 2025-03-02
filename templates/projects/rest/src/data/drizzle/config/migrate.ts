import 'src/config/index.js'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { db } from 'src/data/drizzle/config/orm.js'

await migrate(db, { migrationsFolder: './src/data/drizzle/migrations' })
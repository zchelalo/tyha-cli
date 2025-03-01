import pg from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from 'src/data/drizzle/schemas.js'

const { Pool } = pg

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: false
})

export const db = drizzle(pool, {
  schema: schema,
  logger: true
})
import 'src/config/index'
import { defineConfig } from 'drizzle-kit'

/**
 * Configuration for drizzle-kit.
 */
export default defineConfig({
  schema: './src/data/drizzle/schemas/index.ts',
  out: './src/data/drizzle/migrations',
  dialect: 'postgresql',
  verbose: true,
  dbCredentials: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: false
  }
})
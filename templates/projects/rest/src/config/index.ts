import { config as configEnv } from 'dotenv'
import { z } from 'zod'

/**
 * Load environment variables from .env file
 * If NODE_ENV is test, load from .env.test file
 * Otherwise, load from .env file
 */
configEnv({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' })

/**
 * Environment variables
 */
const envVars = {
  /**
   * Node.js environment
   */
  NODE_ENV: process.env.NODE_ENV,

  /**
   * Port to run the server on
   */
  PORT: Number(process.env.PORT),

  /**
   * Default limit for pagination
   */
  PAGINATION_LIMIT_DEFAULT: Number(process.env.PAGINATION_LIMIT_DEFAULT),

  /**
   * Database connection details
   */
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT),
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME,

  WHITE_LISTED_DOMAINS: process.env.WHITE_LISTED_DOMAINS
}

/**
 * Environment variables schema
 */
const config = z.object({
  NODE_ENV: z.string(),
  PORT: z.number().int(),

  PAGINATION_LIMIT_DEFAULT: z.number().int(),

  DB_HOST: z.string(),
  DB_PORT: z.number().int(),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_NAME: z.string(),

  WHITE_LISTED_DOMAINS: z.string()
})

/**
 * Validate environment variables
 */
config.parse(envVars)

/**
 * Declare global namespace for environment variables.
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof config> {}
  }
}
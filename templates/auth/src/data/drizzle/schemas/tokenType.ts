import { relations } from 'drizzle-orm'
import { pgTable, varchar, timestamp, uuid } from 'drizzle-orm/pg-core'

import { token } from 'src/data/drizzle/schemas/token.js'

export const tokenType = pgTable('token_types', {
  id: uuid('id').primaryKey(),
  key: varchar('key').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const tokenTypeRelations = relations(tokenType, ({ many }) => ({
  tokens: many(token)
}))
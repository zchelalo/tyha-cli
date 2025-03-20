import { relations } from 'drizzle-orm'
import { pgTable, varchar, timestamp, uuid } from 'drizzle-orm/pg-core'

import { user } from 'src/data/drizzle/schemas/user'

export const role = pgTable('roles', {
  id: uuid('id').primaryKey(),
  key: varchar('key').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const roleRelations = relations(role, ({ many }) => ({
  users: many(user)
}))
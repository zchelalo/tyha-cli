import { relations } from 'drizzle-orm'
import { pgTable, varchar, timestamp, boolean, uuid } from 'drizzle-orm/pg-core'

import { token } from 'src/data/drizzle/schemas/token.js'
import { role } from 'src/data/drizzle/schemas/role.js'

export const user = pgTable('users', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 100 }).notNull(),
  verified: boolean('verified').default(false),
  roleId: uuid('role_id').notNull().references(() => role.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const userRelations = relations(user, ({ many, one }) => ({
  tokens: many(token),
  role: one(role, {
    fields: [user.roleId],
    references: [role.id]
  })
}))
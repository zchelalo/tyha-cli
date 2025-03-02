import { pgTable, varchar, timestamp, boolean, uuid } from 'drizzle-orm/pg-core'

export const user = pgTable('users', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 100 }).notNull(),
  verified: boolean('verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})
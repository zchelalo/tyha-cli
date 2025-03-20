import 'src/config/index'
import { db } from 'src/data/drizzle/config/orm'
import * as schema from 'src/data/drizzle/schemas/index'
import { logger } from 'src/helpers/logger'
import { v4 } from 'uuid'

async function main() {
  logger.info('seeding started')

  const tokenTypes = await db.select().from(schema.tokenType)
  if (tokenTypes.length === 0) {
    const types = ['refresh', 'recover', 'verify']
    for (const type of types) {
      await db.insert(schema.tokenType).values({
        id: v4(),
        key: type
      })
    }
  }

  const roles = await db.select().from(schema.role)
  if (roles.length === 0) {
    const roles = ['user', 'admin']
    for (const role of roles) {
      await db.insert(schema.role).values({
        id: v4(),
        key: role
      })
    }
  }
}

main()
  .then(() => {
    logger.info('seeding finished')
    process.exit(0)
  })
  .catch((error) => {
    logger.error(error)
    process.exit(1)
  })
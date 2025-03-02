import 'src/config/index.js'
import { logger } from 'src/helpers/logger.js'

async function main() {
  logger.info('seeding started')
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
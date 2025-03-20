import 'src/config/index'
import { logger } from 'src/helpers/logger'

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
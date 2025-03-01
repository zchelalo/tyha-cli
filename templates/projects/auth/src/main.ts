import 'src/config/index.js'

import { Server } from 'src/config/server.js'

import { router as authRouter } from 'src/modules/auth/infrastructure/router.js'

function main() {
  const server = new Server(
    process.env.PORT,
    process.env.WHITE_LISTED_DOMAINS.split(','),
    [
      authRouter
    ]
  )
  
  server.start()
}

main()
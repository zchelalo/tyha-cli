import 'src/config/index'

import { Server } from 'src/config/server'

import { router as authRouter } from 'src/modules/auth/infrastructure/router'

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
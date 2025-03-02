import 'src/config/index.js'

import { Server } from 'src/config/server.js'

import { router as userRouter } from 'src/modules/user/infrastructure/router.js'

function main() {
  const server = new Server(
    process.env.PORT,
    process.env.WHITE_LISTED_DOMAINS.split(','),
    [
      userRouter
    ]
  )
  
  server.start()
}

main()
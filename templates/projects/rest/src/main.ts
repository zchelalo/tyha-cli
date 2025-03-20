import 'src/config/index'

import { Server } from 'src/config/server'

import { router as userRouter } from 'src/modules/user/infrastructure/router'

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
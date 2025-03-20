import express from 'express'
import http from 'http'

import { MiddlewareConfig } from 'src/config/middleware'
import { RouteConfig } from 'src/config/routes'

import { logger } from 'src/helpers/logger'	

export class Server {
  private port: number
  private app: express.Express
  private httpServer: http.Server
  private whitelist: string[]
  private expressRouters: express.Router[]

  constructor(port: number, whitelist: string[], expressRouters: express.Router[]) {
    this.port = port
    this.whitelist = whitelist
    this.expressRouters = expressRouters

    this.app = express()
    this.httpServer = http.createServer(this.app)
  }

  public start() {
    const middlewareConfig = new MiddlewareConfig(this.app, this.whitelist)
    const routeConfig = new RouteConfig(this.app, this.expressRouters)

    middlewareConfig.setPreRoutesMiddlewares()
    routeConfig.setRoutes()
    middlewareConfig.setErrorMiddlewares()

    this.httpServer.listen(this.port, () => {
      logger.info(`Server is running on port ${this.port}`)
    })
  }
}

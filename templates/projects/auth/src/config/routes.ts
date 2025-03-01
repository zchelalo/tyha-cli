import express from 'express'

export class RouteConfig {
  private app: express.Express
  private expressRouters: express.Router[]

  constructor(app: express.Express, expressRouters: express.Router[]) {
    this.app = app
    this.expressRouters = expressRouters
  }

  public setRoutes() {
    this.expressRouters.forEach(router => {
      this.app.use('/api', router)
    })
  }
}

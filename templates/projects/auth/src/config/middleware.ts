import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { responseMiddleware } from 'src/middlewares/response'
import { logRequestMiddleware } from 'src/middlewares/log_request'
import { logErrors, unknownErrorHandler, customErrorHandler } from 'src/middlewares/error'

import { ForbiddenError } from 'src/helpers/errors/custom_error'

export class MiddlewareConfig {
  private app: express.Express
  private whitelist: string[]

  constructor(app: express.Express, whitelist: string[]) {
    this.app = app
    this.whitelist = whitelist
  }

  public setPreRoutesMiddlewares() {
    this.app.use(express.json())
    this.app.use(cookieParser())
    this.app.use(logRequestMiddleware)
    this.app.use(responseMiddleware)

    this.app.use(cors({
      origin: (origin, callback) => {
        if (this.whitelist.includes(origin as string) || !origin) {
          callback(null, true)
        } else {
          callback(new ForbiddenError())
        }
      },
      credentials: true
    }))
  }

  public setErrorMiddlewares() {
    this.app.use(logErrors)
    this.app.use(customErrorHandler)
    this.app.use(unknownErrorHandler)
  }
}

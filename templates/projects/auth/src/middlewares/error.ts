import { NextFunction, Request, Response } from 'express'
import { CustomError } from 'src/helpers/errors/custom_error'
import { logger } from 'src/helpers/logger'

/**
 * If the response contains an error, it logs the error message. This is the first error handler in the middleware chain.
 * 
 * @param {Error} err - The error obtained.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function, used to pass the error to the error handler if an error occurs.
 * @returns {void} A promise that resolves to void.
 * @example
 * ```ts
 * const router = Router()
 * router.get('/users', controller.getUsers)
 * router.use(logErrors)
 * ```
*/
export const logErrors = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  logger.error(err.message)
  next(err)
}

/**
 * If the response contains an unknown error, it sends a 500 status code with the error message. This is the last error handler in the middleware chain.
 * 
 * @param {Error} err - The error obtained.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object, used to send an error response.
 * @param {NextFunction} next - The Express next function.
 * @returns {void} A promise that resolves to void.
 * @example
 * ```ts
 * const router = Router()
 * router.get('/users', controller.getUsers)
 * router.use(unknownErrorHandler)
 * ```
*/
export const unknownErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  res.sendError({
    status: 500,
    message: err.message,
    details: null
  })
}

/**
 * If the response contains an unknown error, it sends a 500 status code with the error message.
 * 
 * @param {Error} err - The error obtained.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object, used to send an error response if the error is a CustomError.
 * @param {NextFunction} next - The Express next function, used to pass the error to the next middleware if the error is not a CustomError.
 * @returns {void} A promise that resolves to void.
 * @example
 * ```ts
 * const router = Router()
 * router.get('/users', controller.users)
 * router.use(customErrorHandler)
 * ```
*/
export const customErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof CustomError) {
    res.sendError({
      status: err.statusCode,
      message: err.message,
      details: null
    })
  } else {
    next(err)
  }
}
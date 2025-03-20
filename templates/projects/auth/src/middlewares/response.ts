import { Request, Response, NextFunction } from 'express'
import { SuccessResponse, ErrorResponse } from 'src/utils/response'

/**
 * This middleware adds the sendSuccess and sendError methods to the response object. The sendSuccess method sends a success response with the status, message, data, and meta properties. The sendError method sends an error response with the status, message, and details properties. This middleware must be used before any other middleware that sends a response.
 * 
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object, used to send a success or error response.
 * @param {NextFunction} next - The Express next function, used to pass the control to the next middleware.
 * @returns {void} A promise that resolves to void.
 * @example
 * ```ts
 * const router = Router()
 * router.use(responseMiddleware)
 * router.get('/users', controller.getUsers)
 * ```
*/
export const responseMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  res.sendSuccess = ({ status, message, data, meta }: SuccessResponse) => {
    res.status(status).json({
      status,
      message,
      data,
      meta
    })
    return res
  }

  res.sendError = ({ status, message, details }: ErrorResponse) => {
    res.status(status).json({
      status,
      message,
      details
    })
    return res
  }

  next()
}
import { Request, Response, NextFunction } from 'express'
import { z, ZodError } from 'zod'

/**
 * The type of request data to validate (body, query, or params).
 * @enum
*/
export enum Type {
  /**
   * The request body.
  */
  BODY = 'body',

  /**
   * The request query parameters.
  */
  QUERY = 'query',

  /**
   * The request URL parameters.
  */
  PARAMS = 'params'
}

/**
 * This middleware validates the request data against a schema. If the data is valid, it calls the next middleware. If the data is invalid, it sends a 400 status code with the error message. This middleware must be used before any other middleware that requires validation.
 * 
 * @param {z.ZodObject<any, any>} schema - The Zod schema used to validate the request data.
 * @param {Type} type - The type of request data to validate (body, query, or params).
 * @returns {(req: Request, res: Response, next: NextFunction): void} A function that validates the request data against the schema.
 * @example
 * ```ts
 * const router = Router()
 * 
 * const schema = z.object({
 *  name: z.string()
 * })
 * 
 * router.post('/users', validateData(schema), controller.createUser)
 * ```
*/
export function validateData(schema: z.ZodObject<any, any>, type: Type): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req[type])
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join('.')}: ${issue.message}`,
        }))
        res.sendError({
          status: 400,
          message: 'invalid data',
          details: errorMessages
        })
      } else {
        res.sendError({
          status: 500,
          message: 'internal server error',
          details: null
        })
      }
    }
  }
}
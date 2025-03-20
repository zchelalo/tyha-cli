import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import jest from 'jest-mock'
import { validateData, Type } from 'src/middlewares/validator'

describe('Validate validateData middleware', () => {
  it('should handle non-ZodError exceptions', () => {
    const req = {
      body: { name: 'John' }
    } as Request

    const res = {
      sendError: jest.fn()
    } as unknown as Response

    const next = jest.fn() as NextFunction

    // Simulamos un error diferente dentro de schema.parse
    const faultySchema = {
      parse: () => {
        throw new Error('Custom error')
      }
    } as unknown as z.ZodObject<any, any>

    const middleware = validateData(faultySchema, Type.BODY)
    middleware(req, res, next)

    expect(res.sendError).toHaveBeenCalledWith({
      status: 500,
      message: 'internal server error',
      details: null
    })
  })
})

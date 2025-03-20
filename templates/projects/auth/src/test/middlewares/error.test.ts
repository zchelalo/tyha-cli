import express from 'express'
import request from 'supertest'

import { responseMiddleware } from 'src/middlewares/response'
import { customErrorHandler, logErrors, unknownErrorHandler } from 'src/middlewares/error'

const app = express()

app.use(express.json())
app.use(responseMiddleware)

app.post('/test', (req, res, next) => {
  try {
    if (!req.body.name) {
      throw new Error('Body is empty')
    }
  
    res.sendSuccess({
      status: 200,
      message: 'success',
      data: null,
      meta: null
    })
  } catch (error) {
    next(next)
  }
})

app.use(logErrors)
app.use(customErrorHandler)
app.use(unknownErrorHandler)

describe('Validate error middleware', () => {
  it('should return status 500 if the body has not name', async () => {
    const response = await request(app).post('/test').send({
      name: null
    })

    expect(response.status).toBe(500)
    expect(response.body.status).toBe(500)

    expect(response.body.message).not.toBeNull()
  })

  it('should return a success response if the body is present', async () => {
    const response = await request(app).post('/test').send({ name: 'John' })
    
    expect(response.status).toBe(200)
    expect(response.body.status).toBe(200)

    expect(response.body.message).not.toBeNull()
  })
})

import { app } from 'src/config/server'
import request from 'supertest'

describe('Server', () => {
  it('should return an error by CORS', async () => {
    const response = await request(app).get('/api/users').set('Origin', 'http://localhost:3000').send()

    expect(response.status).toBe(403)
    expect(response.body.status).toBe(403)

    expect(response.body).toHaveProperty('message')
    expect(response.body.message).not.toBeNull()
  })
})
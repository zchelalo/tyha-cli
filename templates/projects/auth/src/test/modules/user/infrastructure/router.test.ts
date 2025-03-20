import { app } from 'src/config/server'
import request from 'supertest'

describe('User router', () => {
  describe('GET /users', () => {
    it('should return a list of users', async () => {
      const response = await request(app).get('/api/users').send()

      expect(response.status).toBe(200)
      expect(response.body.status).toBe(200)

      expect(response.body.message).not.toBeNull()

      expect(response.body.data).toBeInstanceOf(Array)
      expect(response.body.data.length).toBeGreaterThan(0)
      expect(response.body.data[0]).toHaveProperty('id')
      expect(response.body.data[0]).toHaveProperty('name')
      expect(response.body.data[0]).toHaveProperty('email')

      expect(response.body.meta).not.toBeNull()

      expect(response.body.meta).toHaveProperty('page')
      expect(response.body.meta).toHaveProperty('perPage')
      expect(response.body.meta).toHaveProperty('pageCount')
      expect(response.body.meta).toHaveProperty('totalCount')

      expect(response.body.meta.page).toBe(1)
      expect(response.body.meta.perPage).toBeGreaterThan(1)
      expect(response.body.meta.pageCount).toBe(1)
      expect(response.body.meta.totalCount).toBeGreaterThan(1)
    })

    it('should return a list of users with pagination', async () => {
      const response = await request(app).get('/api/users').query({ page: 1, limit: 2 }).send()

      expect(response.status).toBe(200)
      expect(response.body.status).toBe(200)

      expect(response.body.message).not.toBeNull()

      expect(response.body.data).toBeInstanceOf(Array)
      expect(response.body.data.length).toBeGreaterThan(0)
      expect(response.body.data[0]).toHaveProperty('id')
      expect(response.body.data[0]).toHaveProperty('name')
      expect(response.body.data[0]).toHaveProperty('email')

      expect(response.body.meta).not.toBeNull()

      expect(response.body.meta).toHaveProperty('page')
      expect(response.body.meta).toHaveProperty('perPage')
      expect(response.body.meta).toHaveProperty('pageCount')
      expect(response.body.meta).toHaveProperty('totalCount')

      expect(response.body.meta.page).toBe(1)
      expect(response.body.meta.perPage).toBe(2)
      expect(response.body.meta.pageCount).toBeGreaterThan(1)
      expect(response.body.meta.totalCount).toBeGreaterThan(1)
    })

    it('should return a list of users with pagination and page 2', async () => {
      const response = await request(app).get('/api/users').query({ page: 2, limit: 2 }).send()

      expect(response.status).toBe(200)
      expect(response.body.status).toBe(200)

      expect(response.body.message).not.toBeNull()

      expect(response.body.data).toBeInstanceOf(Array)
      expect(response.body.data.length).toBeGreaterThan(0)
      expect(response.body.data[0]).toHaveProperty('id')
      expect(response.body.data[0]).toHaveProperty('name')
      expect(response.body.data[0]).toHaveProperty('email')

      expect(response.body.meta).not.toBeNull()

      expect(response.body.meta).toHaveProperty('page')
      expect(response.body.meta).toHaveProperty('perPage')
      expect(response.body.meta).toHaveProperty('pageCount')
      expect(response.body.meta).toHaveProperty('totalCount')

      expect(response.body.meta.page).toBe(2)
      expect(response.body.meta.perPage).toBe(2)
      expect(response.body.meta.pageCount).toBeGreaterThan(1)
      expect(response.body.meta.totalCount).toBeGreaterThan(1)
    })

    it('should return a list of users with an invalid pagination (with zero values)', async () => {
      const response = await request(app).get('/api/users').query({ page: 0, limit: 0 }).send()

      expect(response.status).toBe(200)
      expect(response.body.status).toBe(200)

      expect(response.body.message).not.toBeNull()

      expect(response.body.data).toBeInstanceOf(Array)
      expect(response.body.data.length).toBeGreaterThan(0)
      expect(response.body.data[0]).toHaveProperty('id')
      expect(response.body.data[0]).toHaveProperty('name')
      expect(response.body.data[0]).toHaveProperty('email')

      expect(response.body.meta).not.toBeNull()

      expect(response.body.meta).toHaveProperty('page')
      expect(response.body.meta).toHaveProperty('perPage')
      expect(response.body.meta).toHaveProperty('pageCount')
      expect(response.body.meta).toHaveProperty('totalCount')

      expect(response.body.meta.page).toBe(1)
      expect(response.body.meta.perPage).toBeGreaterThan(1)
      expect(response.body.meta.pageCount).toBe(1)
      expect(response.body.meta.totalCount).toBeGreaterThan(1)
    })

    it('should return a list of users with an invalid pagination (with negative values)', async () => {
      const response = await request(app).get('/api/users').query({ page: -1, limit: -1 }).send()

      expect(response.status).toBe(200)
      expect(response.body.status).toBe(200)

      expect(response.body.message).not.toBeNull()

      expect(response.body.data).toBeInstanceOf(Array)
      expect(response.body.data.length).toBeGreaterThan(0)
      expect(response.body.data[0]).toHaveProperty('id')
      expect(response.body.data[0]).toHaveProperty('name')
      expect(response.body.data[0]).toHaveProperty('email')

      expect(response.body.meta).not.toBeNull()

      expect(response.body.meta).toHaveProperty('page')
      expect(response.body.meta).toHaveProperty('perPage')
      expect(response.body.meta).toHaveProperty('pageCount')
      expect(response.body.meta).toHaveProperty('totalCount')

      expect(response.body.meta.page).toBe(1)
      expect(response.body.meta.perPage).toBeGreaterThan(1)
      expect(response.body.meta.pageCount).toBe(1)
      expect(response.body.meta.totalCount).toBeGreaterThan(1)
    })

    it('should return a list of users with an invalid pagination (with high values)', async () => {
      const response = await request(app).get('/api/users').query({ page: 1000, limit: 1000 }).send()

      expect(response.status).toBe(200)
      expect(response.body.status).toBe(200)

      expect(response.body.message).not.toBeNull()

      expect(response.body.data).toBeInstanceOf(Array)
      expect(response.body.data.length).toBeGreaterThan(0)
      expect(response.body.data[0]).toHaveProperty('id')
      expect(response.body.data[0]).toHaveProperty('name')
      expect(response.body.data[0]).toHaveProperty('email')

      expect(response.body.meta).not.toBeNull()

      expect(response.body.meta).toHaveProperty('page')
      expect(response.body.meta).toHaveProperty('perPage')
      expect(response.body.meta).toHaveProperty('pageCount')
      expect(response.body.meta).toHaveProperty('totalCount')

      expect(response.body.meta.page).toBe(1)
      expect(response.body.meta.perPage).toBeGreaterThan(1)
      expect(response.body.meta.pageCount).toBe(1)
      expect(response.body.meta.totalCount).toBeGreaterThan(1)
    })
  })

  describe('GET /users/:id', () => {
    it('should return a user by their ID', async () => {
      const user = {
        name: 'John First',
        email: 'johnfirst@email.com',
        password: '12345678'
      }
      const newUser = await request(app).post('/api/users').send(user)

      const response = await request(app).get(`/api/users/${newUser.body.data.id}`).send()

      expect(response.status).toBe(200)
      expect(response.body.status).toBe(200)

      expect(response.body.message).not.toBeNull()

      expect(response.body.data).toHaveProperty('id')
      expect(response.body.data).toHaveProperty('name')
      expect(response.body.data).toHaveProperty('email')

      expect(response.body.meta).toBeNull()
    })

    it('should return a validation error when the ID is an invalid UUID', async () => {
      const response = await request(app).get('/api/users/1').send()

      expect(response.status).toBe(400)
      expect(response.body.status).toBe(400)

      expect(response.body.message).not.toBeNull()

      expect(response.body.details).toBeInstanceOf(Array)
      expect(response.body.details.length).toBeGreaterThan(0)
      expect(response.body.details[0]).toHaveProperty('message')
    })

    it('should return a not found error when the user does not exist', async () => {
      const response = await request(app).get('/api/users/123e4567-e89b-12d3-a456-426614174999').send()

      expect(response.status).toBe(404)
      expect(response.body.status).toBe(404)

      expect(response.body.message).not.toBeNull()

      expect(response.body.details).toBeNull()
    })
  })

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const user = {
        name: 'John Second',
        email: 'johnsecond@email.com',
        password: '12345678'
      }
      const response = await request(app).post('/api/users').send(user)

      expect(response.status).toBe(201)
      expect(response.body.status).toBe(201)

      expect(response.body.message).not.toBeNull()

      expect(response.body.data).toHaveProperty('id')
      expect(response.body.data).toHaveProperty('name')
      expect(response.body.data).toHaveProperty('email')

      expect(response.body.meta).toBeNull()
    })

    it('should return a validation error when the user email is invalid', async () => {
      const user = {
        name: 'John Third',
        email: 'johnthirdemail.com',
        password: '12345678'
      }
      const response = await request(app).post('/api/users').send(user)

      expect(response.status).toBe(400)
      expect(response.body.status).toBe(400)

      expect(response.body.message).not.toBeNull()

      expect(response.body.details).toBeInstanceOf(Array)
      expect(response.body.details.length).toBeGreaterThan(0)
      expect(response.body.details[0]).toHaveProperty('message')
    })

    it('should return a validation error when the user password is invalid', async () => {
      const user = {
        name: 'John Fourth',
        email: 'johnfourth@email.com',
        password: '1234'
      }
      const response = await request(app).post('/api/users').send(user)

      expect(response.status).toBe(400)
      expect(response.body.status).toBe(400)

      expect(response.body.message).not.toBeNull()

      expect(response.body.details).toBeInstanceOf(Array)
      expect(response.body.details.length).toBeGreaterThan(0)
      expect(response.body.details[0]).toHaveProperty('message')
    })

    it('should return a conflict error when the user already exists', async () => {
      const user = {
        name: 'John Fifth',
        email: 'johnfifth@email.com',
        password: '12345678'
      }
      const newUser = await request(app).post('/api/users').send(user)
      expect(newUser.status).toBe(201)
      expect(newUser.body.status).toBe(201)

      const newUserObtained = await request(app).get(`/api/users/${newUser.body.data.id}`).send()
      expect(newUserObtained.status).toBe(200)
      expect(newUserObtained.body.status).toBe(200)

      const response = await request(app).post('/api/users').send(user)

      expect(response.status).toBe(409)
      expect(response.body.status).toBe(409)

      expect(response.body.message).not.toBeNull()

      expect(response.body.details).toBeNull()
    })
  })
})
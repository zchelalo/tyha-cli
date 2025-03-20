import { MemoryRepository } from 'src/modules/user/infrastructure/repositories/memory'
import { UserUseCase } from 'src/modules/user/application/use_cases/user'
import { NotFoundError } from 'src/helpers/errors/custom_error'
import { ZodError } from 'zod'

describe('User use case', () => {
  let userUseCase: UserUseCase

  beforeAll(() => {
    const userRepository = new MemoryRepository()
    userUseCase = new UserUseCase(userRepository)
  })

  describe('getUserById', () => {
    it('should return a user by their ID', async () => {
      const user = {
        name: 'Jane First',
        email: 'janefirst@email.com',
        password: '12345678'
      }
      const newUser = await userUseCase.createUser(user)

      const userObtained = await userUseCase.getUserById(newUser.id)

      expect(userObtained).toBeDefined()
      expect(userObtained.id).toBe(newUser.id)
      expect(userObtained.name).toBe(user.name)
      expect(userObtained.email).toBe(user.email)
    })

    it('should throw an error if the ID is not a valid UUID', async () => {
      await expect(userUseCase.getUserById('1')).rejects.toThrow(ZodError)
    })

    it('should throw an error if the ID is empty', async () => {
      await expect(userUseCase.getUserById('')).rejects.toThrow(ZodError)
    })
  })

  describe('getUserByEmail', () => {
    it('should return a user by their email', async () => {
      const user = {
        name: 'Jane Second',
        email: 'janesecond@email.com',
        password: '12345678'
      }
      const newUser = await userUseCase.createUser(user)

      const userObtained = await userUseCase.getUserByEmail(newUser.email)

      expect(userObtained).toBeDefined()
      expect(userObtained.id).toBe(newUser.id)
      expect(userObtained.name).toBe(user.name)
      expect(userObtained.email).toBe(user.email)
    })

    it('should throw an error if the user does not exist', async () => {
      await expect(userUseCase.getUserByEmail('testingemail@email.com')).rejects.toThrow(NotFoundError)
    })

    it('should throw an error if the email is not valid', async () => {
      await expect(userUseCase.getUserByEmail('testingemailemail.com')).rejects.toThrow(ZodError)
    })

    it('should throw an error if the email is empty', async () => {
      await expect(userUseCase.getUserByEmail('')).rejects.toThrow(ZodError)
    })
  })

  describe('getUsers', () => {
    it('should return a page of users', async () => {
      const offset = 0
      const limit = 10
      const users = await userUseCase.getUsers(offset, limit)

      expect(users).toBeDefined()
      expect(users.length).toBeGreaterThan(0)
      expect(users[0]).toHaveProperty('id')
      expect(users[0]).toHaveProperty('name')
      expect(users[0]).toHaveProperty('email')
    })

    it('should throw an error if the offset is not a valid integer', async () => {
      const offset = '0' as unknown as number
      const limit = 10
      await expect(userUseCase.getUsers(offset, limit)).rejects.toThrow(ZodError)
    })

    it('should throw an error if the limit is not a valid integer', async () => {
      const offset = 0
      const limit = '10' as unknown as number
      await expect(userUseCase.getUsers(offset, limit)).rejects.toThrow(ZodError)
    })

    it('should throw an error if the offset is negative', async () => {
      const offset = -1
      const limit = 10
      await expect(userUseCase.getUsers(offset, limit)).rejects.toThrow(ZodError)
    })

    it('should throw an error if the limit is zero', async () => {
      const offset = 0
      const limit = 0
      await expect(userUseCase.getUsers(offset, limit)).rejects.toThrow(ZodError)
    })
  })

  describe('count', () => {
    it('should return the count of users', async () => {
      const count = await userUseCase.count()

      expect(count).toBeDefined()
      expect(count).toBeGreaterThanOrEqual(0)
    })
  })

  describe('createUser', () => {
    it('should create a user', async () => {
      const user = {
        name: 'Jane Third',
        email: 'janethird@email.com',
        password: '12345678'
      }

      const newUser = await userUseCase.createUser(user)

      expect(newUser).toBeDefined()
      expect(newUser.id).toBeDefined()
      expect(newUser.name).toBe(user.name)
      expect(newUser.email).toBe(user.email)
    })

    it('should throw an error if the name is empty', async () => {
      const user = {
        name: '',
        email: 'janefourth@email.com',
        password: '12345678'
      }

      await expect(userUseCase.createUser(user)).rejects.toThrow(ZodError)
    })

    it('should throw an error if the name is less of three characters', async () => {
      const user = {
        name: 'Ja',
        email: 'janefifth@email.com',
        password: '12345678'
      }

      await expect(userUseCase.createUser(user)).rejects.toThrow(ZodError)
    })

    it('should throw an error if the email is empty', async () => {
      const user = {
        name: 'Jane Sixth',
        email: '',
        password: '12345678'
      }

      await expect(userUseCase.createUser(user)).rejects.toThrow(ZodError)
    })

    it('should throw an error if the email is not valid', async () => {
      const user = {
        name: 'Jane Seventh',
        email: 'janeseventhemail.com',
        password: '12345678'
      }

      await expect(userUseCase.createUser(user)).rejects.toThrow(ZodError)
    })

    it('should throw an error if the password is empty', async () => {
      const user = {
        name: 'Jane Eighth',
        email: 'janeeighth@email.com',
        password: ''
      }

      await expect(userUseCase.createUser(user)).rejects.toThrow(ZodError)
    })

    it('should throw an error if the password is less of eight characters', async () => {
      const user = {
        name: 'Jane Ninth',
        email: 'janeninth@email.com',
        password: '1234567'
      }

      await expect(userUseCase.createUser(user)).rejects.toThrow(ZodError)
    })
  })
})
import { Request, Response, NextFunction } from 'express'
import { UserUseCase } from 'src/modules/user/application/use_cases/user'
import { UserController } from 'src/modules/user/infrastructure/controller'
import jest from 'jest-mock'

// Crea mocks para UserUseCase
const mockGetUsers = jest.fn()
const mockCount = jest.fn()

const mockUseCase = {
  getUsers: mockGetUsers,
  count: mockCount
} as unknown as UserUseCase

// Crea una instancia del controlador con el use case mockeado
const userController = new UserController(mockUseCase)

// Configura la prueba
describe('User controller', () => {
  it('should pass errors to the next middleware', async () => {
    const error = new Error('simulated error')

    // Simula un error en getUsers
    mockGetUsers.mockRejectedValue(error as never)

    const req = {
      pagination: {
        page: 1,
        limit: 10
      }
    } as Request
    const res = {} as Response
    const next = jest.fn() as NextFunction

    await userController.getUsers(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })
})
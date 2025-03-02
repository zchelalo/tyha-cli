import { Router } from 'express'

import { PostgresRepository as UserPostgresRepository } from 'src/modules/user/infrastructure/repositories/postgres.js'
import { UserUseCase } from 'src/modules/user/application/use_cases/user.js'
import { UserController } from 'src/modules/user/infrastructure/controller.js'

import { validateData, Type } from 'src/middlewares/validator.js'

import {
  createUserSchema,
  getUserByIDSchema,
  paginationSchema
} from 'src/modules/user/application/schemas/user.js'

const router = Router()

const userRepository = new UserPostgresRepository()
const useCase = new UserUseCase(userRepository)
const userController = new UserController(useCase)

router.get('/users/:id', validateData(getUserByIDSchema, Type.PARAMS), userController.getUserById)
router.get('/users', validateData(paginationSchema, Type.QUERY), userController.getUsers)
router.post('/users', validateData(createUserSchema, Type.BODY), userController.createUser)

export { router }
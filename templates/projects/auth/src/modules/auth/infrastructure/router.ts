import { Router } from 'express'

import { PostgresRepository as UserPostgresRepository } from 'src/modules/user/infrastructure/repositories/postgres.js'
import { PostgresRepository as AuthPostgresRepository } from 'src/modules/auth/infrastructure/repositories/postgres.js'
import { AuthUseCase } from 'src/modules/auth/application/use_cases/auth.js'
import { AuthController } from 'src/modules/auth/infrastructure/controller.js'

import { authMiddleware } from 'src/middlewares/auth.js'
import { validateData, Type } from 'src/middlewares/validator.js'

import { signInSchema } from 'src/modules/auth/application/schemas/auth.js'
import { createUserSchema } from 'src/modules/user/application/schemas/user.js'

const router = Router()

const authRepository = new AuthPostgresRepository()
const userRepository = new UserPostgresRepository()
const useCase = new AuthUseCase(authRepository, userRepository)
const authController = new AuthController(useCase)

router.post('/auth/sign-in', validateData(signInSchema, Type.BODY), authController.signIn)
router.post('/auth/sign-up', validateData(createUserSchema, Type.BODY), authController.signUp)
router.post('/auth/sign-out', authMiddleware, authController.signOut)

export { router }
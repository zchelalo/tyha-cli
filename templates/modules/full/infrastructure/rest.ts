import { Router } from 'express'

import { {{repositoryName}}Repository as {{name}}Repository } from 'src/modules/{{nameClean}}/infrastructure/repositories/{{repositoryClean}}.js'
import { {{name}}UseCase } from 'src/modules/{{nameClean}}/application/use_cases/{{nameClean}}.js'
import { {{name}}Controller } from 'src/modules/{{nameClean}}/infrastructure/controller.js'

import { validateData, Type } from 'src/middlewares/validator.js'

import { get{{name}}ByIdSchema } from 'src/modules/{{nameClean}}/application/schemas/{{nameClean}}.js'

const router = Router()

const {{nameCamel}}Repository = new {{name}}Repository()
const useCase = new {{name}}UseCase({{nameCamel}}Repository)
const {{nameCamel}}Controller = new {{name}}Controller(useCase)

router.get('/{{nameKebab}}/:id', validateData(get{{name}}ByIdSchema, Type.PARAMS), {{nameCamel}}Controller.getById)

export { router }
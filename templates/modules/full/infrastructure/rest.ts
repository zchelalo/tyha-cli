import { Router } from 'express'

import { {{repositoryName}}Repository as {{name}}Repository } from 'src/modules/{{nameClean}}/infrastructure/repositories/{{repositoryClean}}'
import { {{name}}UseCase } from 'src/modules/{{nameClean}}/application/use_cases/{{nameClean}}'
import { {{name}}Controller } from 'src/modules/{{nameClean}}/infrastructure/controller'

import { validateData, Type } from 'src/middlewares/validator'

import { get{{name}}ByIdSchema } from 'src/modules/{{nameClean}}/application/schemas/{{nameClean}}'

const router = Router()

const {{nameCamel}}Repository = new {{name}}Repository()
const useCase = new {{name}}UseCase({{nameCamel}}Repository)
const {{nameCamel}}Controller = new {{name}}Controller(useCase)

router.get('/{{nameKebab}}/:id', validateData(get{{name}}ByIdSchema, Type.PARAMS), {{nameCamel}}Controller.get{{name}}ById)

export { router }
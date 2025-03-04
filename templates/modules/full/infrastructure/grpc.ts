import * as grpc from '@grpc/grpc-js'

import { {{name}}ServiceServer } from 'src/proto/{{nameClean}}.js'

import { {{name}}UseCase } from 'src/modules/{{nameClean}}/application/use_cases/{{nameClean}}.js'
import { {{repositoryName}}Repository as {{name}}Repository } from 'src/modules/{{nameClean}}/infrastructure/repositories/{{repositoryClean}}.js'
import { {{name}}Controller } from 'src/modules/{{nameClean}}/infrastructure/controller.js'

import { applyMiddleware } from 'src/middlewares/base.js'
import { logRequestMiddleware } from 'src/middlewares/log_request.js'

const {{nameCamel}}Repository = new {{name}}Repository()
const useCase = new {{name}}UseCase({{nameCamel}}Repository)
const {{nameCamel}}Controller = new {{name}}Controller(useCase)

export const {{nameCamel}}Service: {{name}}ServiceServer = {
  get{{name}}: applyMiddleware({{nameCamel}}Controller.get{{name}}ById, logRequestMiddleware()),
}
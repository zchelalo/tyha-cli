import * as grpc from '@grpc/grpc-js'

import { {{name}}ServiceServer } from 'src/proto/{{nameClean}}'

import { {{name}}UseCase } from 'src/modules/{{nameClean}}/application/use_cases/{{nameClean}}'
import { {{repositoryName}}Repository as {{name}}Repository } from 'src/modules/{{nameClean}}/infrastructure/repositories/{{repositoryClean}}'
import { {{name}}Controller } from 'src/modules/{{nameClean}}/infrastructure/controller'

import { applyMiddleware } from 'src/middlewares/base'
import { logRequestMiddleware } from 'src/middlewares/log_request'

const {{nameCamel}}Repository = new {{name}}Repository()
const useCase = new {{name}}UseCase({{nameCamel}}Repository)
const {{nameCamel}}Controller = new {{name}}Controller(useCase)

export const {{nameCamel}}Service: {{name}}ServiceServer = {
  get{{name}}: applyMiddleware({{nameCamel}}Controller.get{{name}}ById, logRequestMiddleware()),
}
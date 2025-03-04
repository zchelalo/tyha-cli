import { {{name}}UseCase } from 'src/modules/{{nameClean}}/application/use_cases/{{nameClean}}.js'

import * as grpc from '@grpc/grpc-js'
import {
  {{name}},
  Get{{name}}Request,
  Get{{name}}Response,
} from 'src/proto/{{nameClean}}.js'
import { handlerErrors } from 'src/helpers/errors/handler.js'
import { get{{name}}ByIdSchema } from 'src/modules/{{nameClean}}/application/schemas/{{nameClean}}.js'

export class {{name}}Controller {
  private readonly useCase: {{name}}UseCase

  constructor(useCase: AuthUseCase) {
    this.useCase = useCase
  }

  public get{{name}}ById = async (call: grpc.ServerUnaryCall<Get{{name}}Request, any>, callback: grpc.sendUnaryData<Get{{name}}Response>): Promise<void> => {
    try {
      const { id } = call.request
      get{{name}}ByIdSchema.parse({ id })

      const result = await this.useCase.get{{name}}ById(id)
  
      const {{nameCamel}}: {{name}} = {
        id: result.id,
      }
  
      const {{nameCamel}}Response: Get{{name}}Response = {
        {{nameCamel}}
      }
  
      callback(null, {{nameCamel}}Response)
    } catch (error) {
      let errorResponse
      if (error instanceof Error) {
        errorResponse = handlerErrors(error)
      } else {
        errorResponse = {
          code: grpc.status.UNKNOWN,
          message: 'Unknown error'
        }
      }

      const response: Get{{name}}Response = {
        error: errorResponse
      }
      callback(null, response)
    }
  }
}
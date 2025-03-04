import { {{name}}Repository } from 'src/modules/{{nameClean}}/domain/repository.js'
import { {{name}}Value } from 'src/modules/{{nameClean}}/domain/value.js'

import {
  {{name}}ServiceClient,
  Get{{name}}Request,
  Get{{name}}Response
} from 'src/proto/{{nameClean}}.js'

import { NotFoundError, InternalServerError } from 'src/helpers/errors/custom_error.js'

import { logger } from 'src/helpers/logger.js'
import { grpcCodeToError } from 'src/helpers/errors/handler.js'

/**
 * {{repositoryName}}Repository class.
 * 
 * This class implements the {{name}}Repository interface to provide methods for interacting with {{repositoryName}}.
 * 
 * @implements {{{name}}Repository}
 * @example
 * ```ts
 * const repository = new {{repositoryName}}Repository()
 * ```
*/
export class {{repositoryName}}Repository implements {{name}}Repository {
  readonly client: {{name}}ServiceClient

  /**
   * Constructor of {{repositoryName}}Repository.
   * 
   * @param client - The {{name}}ServiceClient.
   */
  constructor(client: {{name}}ServiceClient) {
    this.client = client
  }

  /**
   * Get a {{nameCamel}} by ID.
   * 
   * @param id - The {{nameCamel}} ID.
   * @returns A promise that resolves with the {{nameCamel}} value.
   * @throws {NotFoundError} If the {{nameCamel}} is not found.
   * @example
   * ```ts
   * const id = '938d6f5b-b4a6-4669-a514-ddb3a23621fc'
   * const {{nameCamel}} = await repository.get{{name}}ById(id)
   * ```
  */
  async get{{name}}ById(id: string): Promise<{{name}}Value> {
    const request: Get{{name}}Request = {
      id
    }

    const response = await new Promise<Get{{name}}Response>((resolve, reject) => {
      this.client.get{{name}}(request, (error, response: Get{{name}}Response) => {
        if (error) {
          logger.error(error.message)
          const errorToThrow = grpcCodeToError(error.code, error.message)
          reject(errorToThrow)
          return
        }

        if (response.error) {
          const errorToThrow = grpcCodeToError(response.error.code, response.error.message)
          logger.error(errorToThrow.message)
          reject(errorToThrow)
          return
        }

        resolve(response)
      })
    })

    if (!response.{{nameCamel}}) {
      const errorToThrow = new InternalServerError('no se ha podido obtener el {{nameCamel}}')
      logger.error(errorToThrow.message)
      throw errorToThrow
    }

    return response.{{nameCamel}}
  }
}
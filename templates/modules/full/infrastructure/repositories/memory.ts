import { {{name}}Entity } from 'src/modules/{{nameClean}}/domain/entity.js'
import { {{name}}Repository } from 'src/modules/{{nameClean}}/domain/repository.js'
import { {{name}}Value } from 'src/modules/{{nameClean}}/domain/value.js'

import { db } from 'src/data/drizzle/config/orm.js'
import { {{nameCamel}} } from 'src/data/drizzle/schemas/index.js'

import { NotFoundError } from 'src/helpers/errors/custom_error.js'

import { v4 as uuid } from 'uuid'

const {{nameCamel}}Data: {{name}}Entity = []
for (let i = 0; i < 10; i++) {
  {{nameCamel}}Data.push({
    id: uuid()
  })
}

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
    const {{nameCamel}}Obtained = {{nameCamel}}Data.find(value => value.id === id)
    if (!{{nameCamel}}Obtained) {
      throw new NotFoundError('{{nameCamel}}')
    }

    return {{nameCamel}}Obtained
  }
}
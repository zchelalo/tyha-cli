import { {{name}}Repository } from 'src/modules/{{nameClean}}/domain/repository'
import { {{name}}Value } from 'src/modules/{{nameClean}}/domain/value'

import { db } from 'src/data/drizzle/config/orm'
import { {{nameCamel}} } from 'src/data/drizzle/schemas/index'

import { NotFoundError } from 'src/helpers/errors/custom_error'

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
    const {{nameCamel}}Obtained = await db
      .select({
        id: {{nameCamel}}.id,
      })
      .from({{nameCamel}})
      .where(eq({{nameCamel}}.id, id))
      .limit(1)

    if (!{{nameCamel}}Obtained.length) {
      throw new NotFoundError('{{nameCamel}}')
    }

    return {{nameCamel}}Obtained[0]
  }
}
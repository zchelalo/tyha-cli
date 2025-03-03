import { UserEntity } from 'src/modules/{{nameClean}}/domain/entity.js'

/**
 * {{name}}Repository interface.
 * 
 * This interface defines the contract for a repository that manages the persistence and retrieval of {{name}}Entity objects.
 * 
 * @interface {{name}}Repository
*/
export interface {{name}}Repository {
  /**
   * Retrieves a {{nameCamel}} by their unique identifier (UUID).
   * 
   * @param {string} uuid - The unique identifier of the user.
   * @returns {Promise<{{name}}Entity>} A promise that resolves to the {{name}}Entity.
  */
  get{{name}}ById(uuid: string): Promise<{{name}}Entity>

  /**
   * Retrieves a list of entities with pagination.
   * 
   * @param {number} offset - The offset for pagination.
   * @param {number} limit - The limit of entities to retrieve.
   * @returns {Promise<{{name}}Entity[]>} A promise that resolves to an array of {{name}}Entity objects.
  */
  list(offset: number, limit: number): Promise<{{name}}Entity[]>

  /**
   * Retrieves the total count of entities.
   * 
   * @returns {Promise<number>} A promise that resolves to the number of entities.
  */
  count(): Promise<number>

  /**
   * Creates a new {{nameCamel}}.
   * 
   * @param {{{name}}Entity} {{nameCamel}} - The {{nameCamel}} entity to be created.
   * @returns {Promise<{{name}}Entity>} A promise that resolves to the newly created {{name}}Entity.
  */
  create{{name}}({{nameCamel}}: {{name}}Entity): Promise<{{name}}Entity>
}
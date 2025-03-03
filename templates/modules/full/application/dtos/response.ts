import { {{name}}Value } from 'src/modules/{{nameClean}}/domain/value.js'

/**
 * Data Transfer Object for {{name}} Response.
 * 
 * This class is responsible for transfering {{nameCamel}} data between different parts of the application or across application boundaries.
*/
export class DTO{{name}}Response {
  /**
   * Creates an instance of DTO{{name}}Response.
   * 
   * @param {{{name}}Value} {{nameCamel}} - The {{nameCamel}} value object from the domain layer.
  */
  constructor({{name}}Value) {
  }
}
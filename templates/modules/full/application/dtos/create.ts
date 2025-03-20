import { {{name}}Value } from 'src/modules/{{nameClean}}/domain/value'

/**
 * Data Transfer Object for Create a {{name}}.
 * 
 * This class is responsible for transfering {{nameCamel}} data between different parts of the application or across application boundaries.
*/
export class DTO{{name}}Create {
  /**
   * Creates an instance of DTO{{name}}Create.
   * 
   * @param {{{name}}Value} {{nameCamel}} - The {{nameCamel}} value object from the domain layer.
  */
  constructor({{nameCamel}}: {{name}}Value) {
  }
}
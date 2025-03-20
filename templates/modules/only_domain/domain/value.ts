import { v4 as uuid } from 'uuid'
import { {{name}}Entity } from 'src/modules/{{nameClean}}/domain/entity'

/**
 * {{name}}Value class.
 * 
 * This class implements the {{name}}Entity interface and represents a value object for a {{nameCamel}}. It automatically generates a UUID for the {{nameCamel}} upon creation.
 * 
 * @implements {{{name}}Entity}
*/
export class {{name}}Value implements {{name}}Entity {
  /**
   * The unique identifier of the {{nameCamel}}.
   * @type {string}
  */
  readonly id: string

  /**
   * Creates a new {{name}}Value instance.
  */
  constructor() {
    this.id = uuid()
  }
}
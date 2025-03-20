import { UserValue } from 'src/modules/user/domain/value'

/**
 * Data Transfer Object for Create a User.
 * 
 * This class is responsible for transferring user data between different parts of the application or across application boundaries.
*/
export class DTOUserCreate {
  /**
   * The name of the user.
  */
  name: string

  /**
   * The email address of the user.
  */
  email: string

  /**
   * The password of the user.
  */
  password: string

  /**
   * Creates an instance of DTOUserCreate.
   * 
   * @param {UserValue} user - The user value object from the domain layer.
  */
  constructor({ name, email, password }: UserValue) {
    this.name = name
    this.email = email
    this.password = password
  }
}
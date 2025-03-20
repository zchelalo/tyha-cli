import { UserValue } from 'src/modules/user/domain/value'

import { userRoles } from 'src/config/constants'

/**
 * Data Transfer Object for User Response.
 * 
 * This class is responsible for transferring user data between different parts of the application or across application boundaries.
*/
export class DTOUserResponse {
  /**
   * The unique identifier of the user.
  */
  id: string

  /**
   * The name of the user.
  */
  name: string

  /**
   * The email address of the user.
  */
  email: string

  /**
   * The role of the user.
  */
  role: userRoles

  /**
   * Creates an instance of DTOUserResponse.
   * 
   * @param {UserValue} user - The user value object from the domain layer.
  */
  constructor({ id, name, email, role }: UserValue) {
    this.id = id
    this.name = name
    this.email = email
    this.role = role
  }
}
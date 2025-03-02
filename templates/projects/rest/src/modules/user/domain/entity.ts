/**
 * Represents a User entity.
 * 
 * This interface defines the structure of an User object in the domain layer.
 * It includes basic user information such as `id`, `name`, `email`, and `password`.
 * 
 * @interface UserEntity
 */
export interface UserEntity {
  /**
   * The unique identifier of the user.
   * @type {string}
  */
  id: string

  /**
   * The name of the user.
   * @type {string}
  */
  name: string

  /**
   * The email address of the user.
   * @type {string}
  */
  email: string

  /**
   * The password of the user, stored as a hashed string.
   * @type {string}
  */
  password: string
}
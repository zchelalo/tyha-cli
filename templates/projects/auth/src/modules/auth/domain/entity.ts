import { UserEntity } from 'src/modules/user/domain/entity'

/**
 * Represents a Auth entity.
 * 
 * This interface defines the structure of an Auth object in the domain layer.
 * It includes basic auth information such as `accessToken`, `refreshToken`, and `user`.
 * 
 * @interface AuthEntity
 */
export interface AuthEntity {
  /**
   * The access token of the user.
   * @type {string}
  */
  accessToken: string

  /**
   * The refresh token of the user.
   * @type {string}
  */
  refreshToken: string

  /**
   * The information of the user.
   * @type {UserEntity}
  */
  user: UserEntity
}
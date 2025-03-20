import { UserEntity } from 'src/modules/user/domain/entity'

/**
 * UserRepository interface.
 * 
 * This interface defines the contract for a repository that manages the persistence and retrieval of UserEntity objects.
 * 
 * @interface UserRepository
*/
export interface UserRepository {
  /**
   * Retrieves a user by their unique identifier (UUID).
   * 
   * @param {string} uuid - The unique identifier of the user.
   * @returns {Promise<UserEntity>} A promise that resolves to the UserEntity.
  */
  getUserById(uuid: string): Promise<UserEntity>

  /**
   * Retrieves a user by their email address.
   * 
   * @param {string} email - The email address of the user.
   * @returns {Promise<UserEntity>} A promise that resolves to the UserEntity.
  */
  getUserByEmail(email: string): Promise<UserEntity>

  /**
   * Retrieves a list of users with pagination.
   * 
   * @param {number} offset - The offset for pagination.
   * @param {number} limit - The limit of users to retrieve.
   * @returns {Promise<UserEntity[]>} A promise that resolves to an array of UserEntity objects.
  */
  getUsers(offset: number, limit: number): Promise<UserEntity[]>

  /**
   * Retrieves the total count of users.
   * 
   * @returns {Promise<number>} A promise that resolves to the number of users.
  */
  count(): Promise<number>

  /**
   * Creates a new user.
   * 
   * @param {UserEntity} user - The user entity to be created.
   * @returns {Promise<UserEntity>} A promise that resolves to the newly created UserEntity.
  */
  createUser(user: UserEntity): Promise<UserEntity>
}
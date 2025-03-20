import { UserEntity } from 'src/modules/user/domain/entity'
import { UserRepository } from 'src/modules/user/domain/repository'
import { ConflictError, NotFoundError } from 'src/helpers/errors/custom_error'

const users: UserEntity[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John One',
    email: 'johnone@email.com',
    password: '12345678',
  },
  {
    id: '123f7890-b12c-34d5-e678-901234567890',
    name: 'John Two',
    email: 'johntwo@email.com',
    password: '12345678',
  },
  {
    id: '123a567b-c89d-01e2-345f-678901234567',
    name: 'John Three',
    email: 'johnthree@email.com',
    password: '12345678',
  },
]

/**
 * MemoryRepository class.
 * 
 * This class implements the UserRepository interface to provide an in-memory data store for user entities. It is primarily used for testing or development purposes.
 * 
 * @implements {UserRepository}
*/
export class MemoryRepository implements UserRepository {
  /**
   * Retrieves a user by their ID from the in-memory store.
   * 
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<UserEntity>} A promise that resolves with the user entity.
   * @throws {NotFoundError} If the user with the given ID does not exist.
  */
  async getUserById(id: string): Promise<UserEntity> {
    const userObtained = users.find(user => user.id === id)
    if (!userObtained) {
      throw new NotFoundError(`user with id ${id}`)
    }
    return userObtained
  }

  /**
   * Retrieves a user by their email from the in-memory store.
   * 
   * @param {string} email - The email of the user to retrieve.
   * @returns {Promise<UserEntity>} A promise that resolves with the user entity.
   * @throws {NotFoundError} If the user with the given email does not exist.
  */
  async getUserByEmail(email: string): Promise<UserEntity> {
    const userObtained = users.find(user => user.email === email)
    if (!userObtained) {
      throw new NotFoundError(`user with email ${email}`)
    }
    return userObtained
  }

  /**
   * Retrieves a list of users from the in-memory store with pagination.
   * 
   * @param {number} offset - The number of users to skip before starting to collect the result set.
   * @param {number} limit - The number of users to return.
   * @returns {Promise<UserEntity[]>} A promise that resolves with an array of user entities.
   * @throws {NotFoundError} If no users are found within the specified range.
  */
  async getUsers(offset: number, limit: number): Promise<UserEntity[]> {
    const usersObtained = users.slice(offset, offset + limit)
    if (usersObtained.length === 0) {
      throw new NotFoundError('users')
    }
    return usersObtained
  }

  /**
   * Counts the total number of users in the in-memory store.
   * 
   * @returns {Promise<number>} A promise that resolves with the total number of users.
  */
  async count(): Promise<number> {
    return users.length
  }

  /**
   * Creates a new user in the in-memory store.
   * 
   * @param {UserEntity} userData - The user entity to be created.
   * @returns {Promise<UserEntity>} A promise that resolves with the created user entity.
   * @throws {ConflictError} If a user with the given email already exists.
  */
  async createUser(userData: UserEntity): Promise<UserEntity> {
    const userExists = users.some(user => user.email === userData.email)
    if (userExists) {
      throw new ConflictError('email already exists')
    }
    users.push(userData)
    return userData
  }
}
import { UserRepository } from 'src/modules/user/domain/repository'
import { UserValue } from 'src/modules/user/domain/value'
import { DTOUserCreate } from 'src/modules/user/application/dtos/user_create'
import { DTOUserResponse } from 'src/modules/user/application/dtos/user_response'
import {
  getUserByIDSchema,
  getUserByEmailSchema,
  paginationSchema,
  createUserSchema
} from 'src/modules/user/application/schemas/user'

import bcrypt from 'bcrypt'

/**
 * Create a new User Use Case.
 * Provides methods to interact with User data including retrieving, creating, and counting users.
 * 
 * This class is part of the application layer in the hexagonal architecture and relies on a UserRepository to access and manipulate user data.
 * 
 * The `UserValue`, `DTOUserCreate` and `DTOUserResponse` are used within these methods and are documented in their respective modules.
 * 
 * @example
 * ```ts
 * const postgresRepository = new PostgresRepository()
 * const userUseCase = new UserUseCase(postgresRepository)
 * ```
 */
export class UserUseCase {
  /**
   * @private
   * @property {UserRepository} userRepository - The repository used to interact with user data.
   * This repository is injected via the constructor to decouple the data access layer from the application logic.
  */
  private readonly userRepository: UserRepository

  /**
   * Creates an instance of UserUseCase.
   * 
   * @param {UserRepository} userRepository - The repository that provides access to user data.
   * The repository is injected to allow for greater flexibility and easier testing.
  */
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  /**
   * @function getUserById
   * @description Get a user by id.
   * @param id - Id of user.
   * @returns {Promise<DTOUserResponse>} A promise that resolves to the DTOUserResponse.
   * @example
   * ```ts
   * const id = '938d6f5b-b4a6-4669-a514-ddb3a23621fc'
   * const user = await userUseCase.getUserById(id)
   * ```
  */
  public async getUserById(id: string): Promise<DTOUserResponse> {
    getUserByIDSchema.parse({ id })

    const userObtained = await this.userRepository.getUserById(id)
    return new DTOUserResponse(userObtained)
  }

  /**
   * @function getUserByEmail
   * @description Get a user by email.
   * @param email - Email of user.
   * @returns {Promise<DTOUserResponse>} A promise that resolves to the DTOUserResponse.
   * @example
   * ```ts
   * const email = 'test@email.com'
   * const user = await userUseCase.getUserByEmail(email)
   * ```
  */
  public async getUserByEmail(email: string): Promise<DTOUserResponse> {
    getUserByEmailSchema.parse({ email })

    const userObtained = await this.userRepository.getUserByEmail(email)
    return new DTOUserResponse(userObtained)
  }

  /**
   * @function getUsers
   * @description Get a page of users.
   * @param offset - The offset of the page.
   * @param limit - The limit of the page.
   * @returns {Promise<DTOUserResponse[]>} A promise that resolves to an array of DTOUserResponse.
   * @example
   * ```ts
   * const offset = 0
   * const limit = 10
   * const users = await userUseCase.getUsers(offset, limit)
   * ```
  */
  public async getUsers(offset: number, limit: number): Promise<DTOUserResponse[]> {
    paginationSchema.parse({ offset, limit })

    const usersObtained = await this.userRepository.getUsers(offset, limit)
    return usersObtained.map(user => new DTOUserResponse(user))
  }

  /**
   * @function count
   * @description Get the count of users.
   * @returns {Promise<number>} A promise that resolves to a number of users.
   * @example
   * ```ts
   * const count = await userUseCase.count()
   * ```
  */
  public async count(): Promise<number> {
    return this.userRepository.count()
  }

  /**
   * @function createUser
   * @description Create a new user. This method hashes the user's password using bcrypt before saving the user.
   * @param user - User to be created.
   * @returns {Promise<DTOUserResponse>} A promise that resolves to the user's DTOUserResponse created.
   * @example
   * ```ts
   * const user = {
   *  name: 'Test',
   *  email: 'test@email.com',
   *  password: '12345678'
   * }
   * const newUser = await userUseCase.createUser(user)
   * ```
  */
  public async createUser(user: DTOUserCreate): Promise<DTOUserResponse> {
    createUserSchema.parse(user)

    const password = await bcrypt.hash(user.password, 10)
    user.password = password
    const userValue = new UserValue(user.name, user.email, user.password, user.role)
    await this.userRepository.createUser(userValue)
    return new DTOUserResponse(userValue)
  }
}
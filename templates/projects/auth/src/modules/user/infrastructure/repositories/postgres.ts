import { UserEntity } from 'src/modules/user/domain/entity'
import { UserRepository } from 'src/modules/user/domain/repository'

import { db } from 'src/data/drizzle/config/orm'
import { role, user } from 'src/data/drizzle/schemas/index'
import { count, desc, eq } from 'drizzle-orm'
import { ConflictError, NotFoundError } from 'src/helpers/errors/custom_error'

import { userRoles } from 'src/config/constants'

/**
 * PostgresRepository class.
 * 
 * This class implements the UserRepository interface to provide methods for interacting with the PostgreSQL database.
 * 
 * @implements {UserRepository}
*/
export class PostgresRepository implements UserRepository {
  /**
   * Retrieves a user by their ID from the database.
   * 
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<UserEntity>} A promise that resolves with the user entity.
   * @throws {NotFoundError} If the user with the given ID does not exist.
  */
  async getUserById(id: string): Promise<UserEntity> {
    const userObtained = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: role.key
      })
      .from(user)
      .innerJoin(role, eq(user.roleId, role.id))
      .where(eq(user.id, id))
      .limit(1)

    if (userObtained.length === 0) {
      throw new NotFoundError(`user with id '${id}'`)
    }
    return {
      ...userObtained[0],
      role: userObtained[0].role as userRoles
    }
  }

  /**
   * Retrieves a user by their email from the database.
   * 
   * @param {string} email - The email of the user to retrieve.
   * @returns {Promise<UserEntity>} A promise that resolves with the user entity.
   * @throws {NotFoundError} If the user with the given email does not exist.
  */
  async getUserByEmail(email: string): Promise<UserEntity> {
    const userObtained = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: role.key
      })
      .from(user)
      .innerJoin(role, eq(user.roleId, role.id))
      .where(eq(user.email, email))
      .limit(1)

    if (userObtained.length === 0) {
      throw new NotFoundError(`user with email '${email}'`)
    }
    return {
      ...userObtained[0],
      role: userObtained[0].role as userRoles
    }
  }

  /**
   * Retrieves a list of users from the database with pagination.
   * 
   * @param {number} offset - The number of users to skip before starting to collect the result set.
   * @param {number} limit - The number of users to return.
   * @returns {Promise<UserEntity[]>} A promise that resolves with an array of user entities.
   * @throws {NotFoundError} If no users are found.
  */
  async getUsers(offset: number, limit: number): Promise<UserEntity[]> {
    const usersObtained = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: role.key
      })
      .from(user)
      .innerJoin(role, eq(user.roleId, role.id))
      .offset(offset)
      .limit(limit)
      .orderBy(desc(user.createdAt))

    if (usersObtained.length === 0) {
      throw new NotFoundError('users')
    }
    return usersObtained.map(user => ({
      ...user,
      role: user.role as userRoles
    }))

  }

  /**
   * Counts the number of users in the database.
   * 
   * @returns {Promise<number>} A promise that resolves with the number of users.
  */
  async count(): Promise<number> {
    const usersCount = await db
      .select({
        count: count()
      })
      .from(user)
      .innerJoin(role, eq(user.roleId, role.id))

    return usersCount[0].count
  }

  /**
   * Creates a new user in the database.
   * 
   * @param {UserEntity} userData - The user entity to be created.
   * @returns {Promise<UserEntity>} A promise that resolves with the created user entity.
   * @throws {ConflictError} If a user with the given email already exists.
   * @throws {DatabaseError} If the user could not be created.
  */
  async createUser(userData: UserEntity): Promise<UserEntity> {
    const userObtained = await db
      .select({
        id: user.id
      })
      .from(user)
      .where(eq(user.email, userData.email))
      .limit(1)

    if (userObtained.length > 0) {
      throw new ConflictError(`email already exists`)
    }

    const roleObtained = await db
      .select({
        id: role.id
      })
      .from(role)
      .where(eq(role.key, userData.role))
      .limit(1)

    if (roleObtained.length === 0) {
      throw new NotFoundError('role')
    }

    const userCreated = await db
      .insert(user)
      .values({
        ...userData,
        roleId: roleObtained[0].id
      })
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password
      })

    return {
      ...userCreated[0],
      role: userData.role
    }
  }
}
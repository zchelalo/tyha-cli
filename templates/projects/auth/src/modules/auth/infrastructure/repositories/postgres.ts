import { AuthRepository } from 'src/modules/auth/domain/repository.js'
import { RoleValue, TokenTypeValue, TokenValue } from 'src/modules/auth/domain/value.js'

import { db } from 'src/data/drizzle/config/orm.js'
import { role, token, tokenType } from 'src/data/drizzle/schemas.js'
import { eq, and } from 'drizzle-orm'

import { NotFoundError } from 'src/helpers/errors/custom_error.js'

/**
 * PostgresRepository class.
 * 
 * This class implements the AuthRepository interface to provide methods for interacting with the PostgreSQL database.
 * 
 * @implements {AuthRepository}
 * @example
 * ```ts
 * const repository = new PostgresRepository()
 * ```
*/
export class PostgresRepository implements AuthRepository {
  /**
   * Get a token by user ID and token value.
   * 
   * @param {string} id - The user ID.
   * @param {string} tokenValue - The token value.
   * @returns {Promise<TokenValue>} A promise that resolves with the token value.
   * @throws {NotFoundError} If the token is not found.
   * @example
   * ```ts
   * const userId = '938d6f5b-b4a6-4669-a514-ddb3a23621fc'
   * const tokenValue = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZDgwNzQwNi1hNTQzLTRlMWYtYjAxOS1jOGIwNWQ1OGM1OWIiLCJpYXQiOjE3MjQ2MzExMjksImV4cCI6MTcyNTkyNzEyOX0.l7WXdoTopPRqeK-TNIgJtCoR863Yot5cJC-jV3v6DwJtrvH9wjqGFPHpgo00z4d9jCbMTEBnUfv2NkFCk4ecPt4YTledruAuxQoULk3NqoaXhn4wlKhQj7w14ngldir_pud4SxXJnfaw_zd1xg6Gd7rDH-LAWUYaNyvs8qt2CRra7pnBA6tBUvrO58HYReJRQU-GQP9PWRmRC4G8H3tpnGEybn4NcNCn-rO-PIgABZ1I3Len1y8ibKMrz53Rc1PTUTInD96RORM5zp5c06qkyUjW9AThFQwmYP9Yzo4z3fBsuvqQFha31lWoqzP5LNk2iOHECuequuLPThtNWdsRyw'
   * const token = await repository.getTokenByUserIdAndValue(userId, tokenValue)
   * ```
  */
  async getTokenByUserIdAndValue(id: string, tokenValue: string): Promise<TokenValue> {
    const tokenObtained = await db
      .select({
        id: token.id,
        token: token.token,
        userId: token.userId,
        tokenTypeId: token.tokenTypeId
      })
      .from(token)
      .where(and(
        eq(token.userId, id),
        eq(token.token, tokenValue)
      ))
      .limit(1)

    if (!tokenObtained.length) {
      throw new NotFoundError('token')
    }

    return tokenObtained[0]
  }

  /**
   * Save a token.
   * 
   * @param {TokenValue} tokenValue - The token value.
   * @returns {Promise<void>} A promise that resolves with a void.
   * @example
   * ```ts
   * const tValue = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZDgwNzQwNi1hNTQzLTRlMWYtYjAxOS1jOGIwNWQ1OGM1OWIiLCJpYXQiOjE3MjQ2MzExMjksImV4cCI6MTcyNTkyNzEyOX0.l7WXdoTopPRqeK-TNIgJtCoR863Yot5cJC-jV3v6DwJtrvH9wjqGFPHpgo00z4d9jCbMTEBnUfv2NkFCk4ecPt4YTledruAuxQoULk3NqoaXhn4wlKhQj7w14ngldir_pud4SxXJnfaw_zd1xg6Gd7rDH-LAWUYaNyvs8qt2CRra7pnBA6tBUvrO58HYReJRQU-GQP9PWRmRC4G8H3tpnGEybn4NcNCn-rO-PIgABZ1I3Len1y8ibKMrz53Rc1PTUTInD96RORM5zp5c06qkyUjW9AThFQwmYP9Yzo4z3fBsuvqQFha31lWoqzP5LNk2iOHECuequuLPThtNWdsRyw'
   * const userId = '938d6f5b-b4a6-4669-a514-ddb3a23621fc'
   * const tokenTypeId = '938d6f5b-b4a6-4669-a514-ddb3a23621fc'
   * const tokenValue = new TokenValue(tValue, userId, tokenTypeId)
   * await repository.saveToken(tokenValue)
   * ```
  */
  async saveToken(tokenValue: TokenValue): Promise<void> {
    await db
      .insert(token)
      .values(tokenValue)
  }

  /**
   * Revoke a token by the user ID and the token value.
   * 
   * @param {string} id - The user ID.
   * @param {string} tokenValue - The token value.
   * @returns {Promise<void>} A promise that resolves with a void.
   * @example
   * ```ts
   * const userId = '938d6f5b-b4a6-4669-a514-ddb3a23621fc'
   * const tokenValue = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZDgwNzQwNi1hNTQzLTRlMWYtYjAxOS1jOGIwNWQ1OGM1OWIiLCJpYXQiOjE3MjQ2MzExMjksImV4cCI6MTcyNTkyNzEyOX0.l7WXdoTopPRqeK-TNIgJtCoR863Yot5cJC-jV3v6DwJtrvH9wjqGFPHpgo00z4d9jCbMTEBnUfv2NkFCk4ecPt4YTledruAuxQoULk3NqoaXhn4wlKhQj7w14ngldir_pud4SxXJnfaw_zd1xg6Gd7rDH-LAWUYaNyvs8qt2CRra7pnBA6tBUvrO58HYReJRQU-GQP9PWRmRC4G8H3tpnGEybn4NcNCn-rO-PIgABZ1I3Len1y8ibKMrz53Rc1PTUTInD96RORM5zp5c06qkyUjW9AThFQwmYP9Yzo4z3fBsuvqQFha31lWoqzP5LNk2iOHECuequuLPThtNWdsRyw'
   * await repository.revokeTokenByUserIdAndValue(userId, tokenValue)
   * ```
  */
  async revokeTokenByUserIdAndValue(id: string, tokenValue: string): Promise<void> {
    await this.getTokenByUserIdAndValue(id, tokenValue)

    await db
      .delete(token)
      .where(and(
        eq(token.userId, id), eq(token.token, tokenValue)
      ))
  }

  /**
   * Get a token type ID by the key.
   * 
   * @param {string} key - The key of the token type.
   * @returns {Promise<TokenTypeValue>} A promise that resolves with a token type value.
   * @throws {NotFoundError} If the token type is not found.
   * @example
   * ```ts
   * const key = 'refresh'
   * const tokenTypeId = await repository.getTokenTypeIdByKey(key)
   * ```
  */
  async getTokenTypeIdByKey(key: string): Promise<TokenTypeValue> {
    const tokenTypeObtained = await db
      .select({
        id: tokenType.id,
        key: tokenType.key
      })
      .from(tokenType)
      .where(eq(tokenType.key, key))
      .limit(1)

    if (!tokenTypeObtained.length) {
      throw new NotFoundError('token type')
    }

    return tokenTypeObtained[0]
  }

  /**
   * Get a token type ID by the key.
   * 
   * @param {string} key - The key of the token type.
   * @returns {Promise<TokenTypeValue>} A promise that resolves with a token type value.
   * @throws {NotFoundError} If the token type is not found.
   * @example
   * ```ts
   * const key = 'refresh'
   * const tokenTypeId = await repository.getTokenTypeIdByKey(key)
   * ```
  */
  async getRoleIdByKey(key: string): Promise<RoleValue> {
    const roleObtained = await db
      .select({
        id: role.id,
        key: role.key
      })
      .from(tokenType)
      .where(eq(tokenType.key, key))
      .limit(1)

    if (!roleObtained.length) {
      throw new NotFoundError('role')
    }

    return roleObtained[0]
  }
}
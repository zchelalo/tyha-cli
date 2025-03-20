import { UserEntity } from 'src/modules/user/domain/entity'
import { AuthEntity } from 'src/modules/auth/domain/entity'

import { v4 } from 'uuid'

/**
 * AuthValue class.
 * 
 * This class implements the AuthEntity interface and represents a value object for a Auth object.
 * 
 * @implements {UserEntity}
 * @example
 * ```ts
 * const accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZDgwNzQwNi1hNTQzLTRlMWYtYjAxOS1jOGIwNWQ1OGM1OWIiLCJpYXQiOjE3MjQ2MzExMjksImV4cCI6MTcyNTkyNzEyOX0.l7WXdoTopPRqeK-TNIgJtCoR863Yot5cJC-jV3v6DwJtrvH9wjqGFPHpgo00z4d9jCbMTEBnUfv2NkFCk4ecPt4YTledruAuxQoULk3NqoaXhn4wlKhQj7w14ngldir_pud4SxXJnfaw_zd1xg6Gd7rDH-LAWUYaNyvs8qt2CRra7pnBA6tBUvrO58HYReJRQU-GQP9PWRmRC4G8H3tpnGEybn4NcNCn-rO-PIgABZ1I3Len1y8ibKMrz53Rc1PTUTInD96RORM5zp5c06qkyUjW9AThFQwmYP9Yzo4z3fBsuvqQFha31lWoqzP5LNk2iOHECuequuLPThtNWdsRyw'
 * const refreshToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZDgwNzQwNi1hNTQzLTRlMWYtYjAxOS1jOGIwNWQ1OGM1OWIiLCJpYXQiOjE3MjQ2MzExMjksImV4cCI6MTcyNTkyNzEyOX0.l7WXdoTopPRqeK-TNIgJtCoR863Yot5cJC-jV3v6DwJtrvH9wjqGFPHpgo00z4d9jCbMTEBnUfv2NkFCk4ecPt4YTledruAuxQoULk3NqoaXhn4wlKhQj7w14ngldir_pud4SxXJnfaw_zd1xg6Gd7rDH-LAWUYaNyvs8qt2CRra7pnBA6tBUvrO58HYReJRQU-GQP9PWRmRC4G8H3tpnGEybn4NcNCn-rO-PIgABZ1I3Len1y8ibKMrz53Rc1PTUTInD96RORM5zp5c06qkyUjW9AThFQwmYP9Yzo4z3fBsuvqQFha31lWoqzP5LNk2iOHECuequuLPThtNWdsRyw'
 * const user = new UserValue('name', 'email', 'password')
 * const auth = new AuthValue(accessToken, refreshToken, user)
 * ```
*/
export class AuthValue implements AuthEntity {
  /**
   * The access token of the user.
   * @type {string}
  */
  readonly accessToken: string

  /**
   * The refresh token of the user.
   * @type {string}
  */
  readonly refreshToken: string

  /**
   * The information of the user.
   * @type {UserEntity}
  */
  readonly user: UserEntity

  /**
   * Creates a new AuthValue instance.
   * 
   * @param {string} accessToken - The access token of the user.
   * @param {string} refreshToken - The refresh token of the user.
   * @param {UserEntity} user - The information of the user.
  */
  constructor(accessToken: string, refreshToken: string, user: UserEntity) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    this.user = user
  }
}

/**
 * TokenValue class.
 * 
 * This class represents a value object for a Token object.
 * 
 * @example
 * ```ts
 * const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZDgwNzQwNi1hNTQzLTRlMWYtYjAxOS1jOGIwNWQ1OGM1OWIiLCJpYXQiOjE3MjQ2MzExMjksImV4cCI6MTcyNTkyNzEyOX0.l7WXdoTopPRqeK-TNIgJtCoR863Yot5cJC-jV3v6DwJtrvH9wjqGFPHpgo00z4d9jCbMTEBnUfv2NkFCk4ecPt4YTledruAuxQoULk3NqoaXhn4wlKhQj7w14ngldir_pud4SxXJnfaw_zd1xg6Gd7rDH-LAWUYaNyvs8qt2CRra7pnBA6tBUvrO58HYReJRQU-GQP9PWRmRC4G8H3tpnGEybn4NcNCn-rO-PIgABZ1I3Len1y8ibKMrz53Rc1PTUTInD96RORM5zp5c06qkyUjW9AThFQwmYP9Yzo4z3fBsuvqQFha31lWoqzP5LNk2iOHECuequuLPThtNWdsRyw'
 * const userId = '938d6f5b-b4a6-4669-a514-ddb3a23621fc'
 * const tokenType = 'refresh'
 * const tokenTypeId = await this.authRepository.getTokenTypeIdByKey(tokenType)
 * const tokenValue = new TokenValue(token, userId, tokenTypeId)
 * ```
*/
export class TokenValue {
  /**
   * The id of the token.
  */
  readonly id: string

  /**
   * The value of the token.
  */
  readonly token: string

  /**
   * The user id of the token.
  */
  readonly userId: string

  /**
   * The token type id of the token.
  */
  readonly tokenTypeId: string

  /**
   * Creates a new TokenValue instance.
   * @param {string} token - The value of the token.
   * @param {string} userId - The user id of the token.
   * @param {string} tokenTypeId - The token type id of the token.
  */
  constructor(token: string, userId: string, tokenTypeId: string) {
    this.id = v4()
    this.token = token
    this.userId = userId
    this.tokenTypeId = tokenTypeId
  }
}

/**
 * TokenTypeValue class.
 * 
 * This class represents a value object for a TokenType object.
 * 
 * @example
 * ```ts
 * const key = 'refresh'
 * const tokenType = new TokenTypeValue(key)
 * ```
*/
export class TokenTypeValue {
  /**
   * The id of the token type.
  */
  readonly id: string

  /**
   * The value of the key of the token type.
  */
  readonly key: string

  /**
   * Creates a new TokenTypeValue instance.
   * @param {string} key - The key of the token type.
  */
  constructor(key: string) {
    this.id = v4()
    this.key = key
  }
}

/**
 * RoleValue class.
 * 
 * This class represents a value object for a Role object.
 * 
 * @example
 * ```ts
 * const key = 'admin'
 * const role = new RoleValue(key)
 * ```
*/
export class RoleValue {
  /**
   * The id of the role.
  */
  readonly id: string

  /**
   * The value of the key of the role.
  */
  readonly key: string

  /**
   * Creates a new RoleValue instance.
   * @param {string} key - The key of the role.
  */
  constructor(key: string) {
    this.id = v4()
    this.key = key
  }
}
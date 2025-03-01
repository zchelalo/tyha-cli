import { AuthRepository } from 'src/modules/auth/domain/repository.js'
import { TokenValue } from 'src/modules/auth/domain/value.js'

import { UserRepository } from 'src/modules/user/domain/repository.js'
import { UserValue } from 'src/modules/user/domain/value.js'

import { DTOAuthResponse } from 'src/modules/auth/application/dtos/auth_response.js'
import { signInSchema, signOutSchema, tokenSchema } from 'src/modules/auth/application/schemas/auth.js'

import { DTOUserCreate } from 'src/modules/user/application/dtos/user_create.js'
import { createUserSchema } from 'src/modules/user/application/schemas/user.js'

import { createJWT, JwtPayload, tokenExpiration, TokenType, verifyJWT } from 'src/utils/jwt.js'
import { durationToMilliseconds } from 'src/utils/time_converter.js'
import { userRoles } from 'src/config/constants.js'

import { InternalServerError, UnauthorizedError } from 'src/helpers/errors/custom_error.js'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

/**
 * Create a new Auth Use Case.
 * Provides methods to interact with Auth data including signing in, signing up, and signing out.
 * 
 * This class is part of the application layer in the hexagonal architecture and relies on a UserRepository to access and manipulate user data and an AuthRepository to access and manipulate tokens data.
 * 
 * The `DTOAuthResponse` is used within these methods and is documented in their respective modules.
 * 
 * @example
 * ```ts
 * const userRepository = new UserPostgresRepository()
 * const authUseCase = new AuthUseCase(userRepository)
 * ```
 */
export class AuthUseCase {
  /**
   * @private
   * @property {AuthRepository} authRepository - The repository used to interact with tokens data.
   * This repository is injected via the constructor to decouple the data access layer from the application logic.
  */
  private readonly authRepository: AuthRepository

  /**
   * @private
   * @property {UserRepository} userRepository - The repository used to interact with user data.
   * This repository is injected via the constructor to decouple the data access layer from the application logic.
  */
  private readonly userRepository: UserRepository

  /**
   * Creates an instance of AuthUseCase.
   * 
   * @param {AuthRepository} authRepository - The repository that provides access to user data.
   * @param {UserRepository} userRepository - The repository that provides access to user data.
   * The repositories are injected to allow for greater flexibility and easier testing.
  */
  constructor(authRepository: AuthRepository, userRepository: UserRepository) {
    this.authRepository = authRepository
    this.userRepository = userRepository
  }

  /**
   * @function signIn
   * @description Sign in a user.
   * @param email - Email of user.
   * @param password - Password of user.
   * @returns {Promise<DTOAuthResponse>} A promise that resolves to the DTOAuthResponse.
   * @throws {UnauthorizedError} If the email or password is incorrect.
   * @example
   * ```ts
   * const email = 'test@email.com'
   * const password = '12345678'
   * const authData = await authUseCase.signIn(email, password)
   * ```
  */
  public async signIn(email: string, password: string): Promise<DTOAuthResponse> {
    signInSchema.parse({ email, password })

    const userObtained = await this.userRepository.getUserByEmail(email)

    const isPasswordMatch = await bcrypt.compare(password, userObtained.password)
    if (!isPasswordMatch) {
      throw new UnauthorizedError()
    }

    const accessToken = await createJWT({ sub: userObtained.id, role: userObtained.role }, TokenType.ACCESS)
    const refreshToken = await createJWT({ sub: userObtained.id, role: userObtained.role }, TokenType.REFRESH)

    const tokenType = await this.authRepository.getTokenTypeIdByKey('refresh')
    const newToken = new TokenValue(refreshToken, userObtained.id, tokenType.id)
    await this.authRepository.saveToken(newToken)

    const authValue = new DTOAuthResponse({
      accessToken,
      refreshToken,
      user: userObtained
    })

    return authValue
  }

  /**
   * @function signUp
   * @description Sign up a user.
   * @param name - The name of the user.
   * @param email - The email of the user.
   * @param password - The password of the user.
   * @returns {Promise<DTOAuthResponse>} A promise that resolves to the DTOAuthResponse.
   * @example
   * ```ts
   * const name = 'test'
   * const email = 'test@email.com'
   * const password = '12345678'
   * const authData = await authUseCase.signUp(name, email, password)
   * ```
  */
  public async signUp(user: DTOUserCreate): Promise<DTOAuthResponse> {
    createUserSchema.parse({ ...user })

    const existUsers = await this.userRepository.count()
    if (existUsers > 0) {
      throw new UnauthorizedError()
    }

    const hashedPassword = await bcrypt.hash(user.password, 10)

    const newUser = new UserValue(user.name, user.email, hashedPassword, userRoles.ADMIN)
    const userCreated = await this.userRepository.createUser(newUser)

    const accessToken = await createJWT({ sub: userCreated.id, role: userCreated.role }, TokenType.ACCESS)
    const refreshToken = await createJWT({ sub: userCreated.id, role: userCreated.role }, TokenType.REFRESH)

    const tokenType = await this.authRepository.getTokenTypeIdByKey('refresh')
    const newToken = new TokenValue(refreshToken, userCreated.id, tokenType.id)
    await this.authRepository.saveToken(newToken)

    const authValue = new DTOAuthResponse({
      accessToken,
      refreshToken,
      user: userCreated
    })

    return authValue
  }

  /**
   * @function signOut
   * @description Sign out a user.
   * @param userId - The id of the user.
   * @param refreshToken - The refresh token of the user.
   * @returns {Promise<void>} A promise that resolves to the void.
   * @throws {UnauthorizedError} If the refresh token is invalid.
   * @example
   * ```ts
   * const userId = '938d6f5b-b4a6-4669-a514-ddb3a23621fc'
   * const refreshToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZDgwNzQwNi1hNTQzLTRlMWYtYjAxOS1jOGIwNWQ1OGM1OWIiLCJpYXQiOjE3MjQ2MzExMjksImV4cCI6MTcyNTkyNzEyOX0.l7WXdoTopPRqeK-TNIgJtCoR863Yot5cJC-jV3v6DwJtrvH9wjqGFPHpgo00z4d9jCbMTEBnUfv2NkFCk4ecPt4YTledruAuxQoULk3NqoaXhn4wlKhQj7w14ngldir_pud4SxXJnfaw_zd1xg6Gd7rDH-LAWUYaNyvs8qt2CRra7pnBA6tBUvrO58HYReJRQU-GQP9PWRmRC4G8H3tpnGEybn4NcNCn-rO-PIgABZ1I3Len1y8ibKMrz53Rc1PTUTInD96RORM5zp5c06qkyUjW9AThFQwmYP9Yzo4z3fBsuvqQFha31lWoqzP5LNk2iOHECuequuLPThtNWdsRyw'
   * await authUseCase.signOut(userId, refreshToken)
   * ```
  */
  public async signOut(userId: string, refreshToken: string): Promise<void> {
    signOutSchema.parse({ userId, refreshToken })

    const payload = await verifyJWT(refreshToken, TokenType.REFRESH)
    if (!payload) {
      throw new UnauthorizedError()
    }

    await this.authRepository.revokeTokenByUserIdAndValue(payload.sub as string, refreshToken)
  }

  /**
   * @function refreshAccessToken
   * @description Refresh the access token of a user.
   * @param refreshToken - The refresh token of the user.
   * @returns {Promise<{ token: string, userId: string }>} A promise that resolves to the new access token and the user id.
   * @throws {UnauthorizedError} If the refresh token is invalid.
   * @example
   * ```ts
   * const refreshToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZDgwNzQwNi1hNTQzLTRlMWYtYjAxOS1jOGIwNWQ1OGM1OWIiLCJpYXQiOjE3MjQ2MzExMjksImV4cCI6MTcyNTkyNzEyOX0.l7WXdoTopPRqeK-TNIgJtCoR863Yot5cJC-jV3v6DwJtrvH9wjqGFPHpgo00z4d9jCbMTEBnUfv2NkFCk4ecPt4YTledruAuxQoULk3NqoaXhn4wlKhQj7w14ngldir_pud4SxXJnfaw_zd1xg6Gd7rDH-LAWUYaNyvs8qt2CRra7pnBA6tBUvrO58HYReJRQU-GQP9PWRmRC4G8H3tpnGEybn4NcNCn-rO-PIgABZ1I3Len1y8ibKMrz53Rc1PTUTInD96RORM5zp5c06qkyUjW9AThFQwmYP9Yzo4z3fBsuvqQFha31lWoqzP5LNk2iOHECuequuLPThtNWdsRyw'
   * const accessData = await authUseCase.refreshAccessToken(refreshToken)
   * ```
  */
  public async refreshAccessToken(rToken: string): Promise<{ accessToken: string, refreshToken: string | undefined, payload: JwtPayload }> {
    tokenSchema.parse({ token: rToken })

    const payload = await verifyJWT(rToken, TokenType.REFRESH)
    if (!payload) {
      throw new UnauthorizedError()
    }

    await this.authRepository.getTokenByUserIdAndValue(payload.sub as string, rToken)

    const accessToken = await createJWT({ sub: payload.sub, role: payload.role }, TokenType.ACCESS)

    let refreshToken = undefined
    if (this.shouldRefreshTheRefreshToken(payload)) {
      await this.authRepository.revokeTokenByUserIdAndValue(payload.sub as string, rToken)

      refreshToken = await createJWT({ sub: payload.sub, role: payload.role }, TokenType.REFRESH)

      const tokenType = await this.authRepository.getTokenTypeIdByKey('refresh')
      const newToken = new TokenValue(refreshToken, payload.sub as string, tokenType.id)
      await this.authRepository.saveToken(newToken)
    }

    return {
      accessToken,
      refreshToken,
      payload: {
        sub: payload.sub,
        role: payload.role
      }
    }
  }

  private shouldRefreshTheRefreshToken(payload: jwt.JwtPayload): boolean {
    const currentTime = Math.floor(Date.now() / 1000)

    if (!payload.exp) {
      throw new InternalServerError('jwt expiration time is missing')
    }

    const expirationTime = payload.exp

    const totalDuration = durationToMilliseconds(tokenExpiration[TokenType.REFRESH])
    const threshold = totalDuration * 0.25

    return (expirationTime - currentTime) < threshold
  }
}
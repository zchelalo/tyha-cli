import { Request, Response, NextFunction } from 'express'
import { AuthUseCase } from 'src/modules/auth/application/use_cases/auth.js'

import { cookieNames } from 'src/config/constants.js'
import { durationToMilliseconds } from 'src/utils/time_converter.js'
import { tokenExpiration, TokenType } from 'src/utils/jwt.js'

import { UnauthorizedError } from 'src/helpers/errors/custom_error.js'

/**
 * AuthController class.
 * 
 * This class handles HTTP requests related to auth operations, such as signing in, signing up and signing out.
 * 
 * @example
 * ```ts
 * const authRepository = new AuthPostgresRepository()
 * const userRepository = new UserPostgresRepository()
 * const authUseCase = new AuthUseCase(authRepository, userRepository)
 * const controller = new AuthController(authUseCase)
 * ```
*/
export class AuthController {
  /**
   * An instance of the AuthUseCase class, which contains the business logic.
   * @private
  */
  private readonly useCase: AuthUseCase

  /**
   * Creates an instance of AuthController.
   * 
   * @param {AuthUseCase} useCase - The use case instance for handling auth-related operations.
  */
  constructor(useCase: AuthUseCase) {
    this.useCase = useCase
  }

  /**
   * Handles the request to sign in a user.
   * 
   * @param {Request} req - The Express request object, containing the sign in data.
   * @param {Response} res - The Express response object, used to send the user data.
   * @param {NextFunction} next - The Express next function, used to pass errors to the error handler.
   * @returns {Promise<void>} A promise that resolves to void.
   * @example
   * ```ts
   * const router = Router()
   * router.post('/sign-in', controller.signIn)
   * ```
  */
  public signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.body
      const authData = await this.useCase.signIn(user.email, user.password)

      // Both cookies are with the same expiration time because if the access token expires, the refresh token will be used to generate a new one. 
      res.cookie(cookieNames.ACCESS_TOKEN, authData.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: durationToMilliseconds(tokenExpiration[TokenType.REFRESH])
      })

      res.cookie(cookieNames.REFRESH_TOKEN, authData.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: durationToMilliseconds(tokenExpiration[TokenType.REFRESH])
      })

      res.sendSuccess({ status: 200, message: 'success', data: authData.user, meta: null })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Handles the request to sign up a user.
   * 
   * @param {Request} req - The Express request object, containing the sign up data.
   * @param {Response} res - The Express response object, used to send the user data.
   * @param {NextFunction} next - The Express next function, used to pass errors to the error handler.
   * @returns {Promise<void>} A promise that resolves to void.
   * @example
   * ```ts
   * const router = Router()
   * router.post('/sign-up', controller.signUp)
   * ```
  */
  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.body
      const authData = await this.useCase.signUp(user)

      // Both cookies are with the same expiration time because if the access token expires, the refresh token will be used to generate a new one. 
      res.cookie(cookieNames.ACCESS_TOKEN, authData.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: durationToMilliseconds(tokenExpiration[TokenType.REFRESH])
      })

      res.cookie(cookieNames.REFRESH_TOKEN, authData.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: durationToMilliseconds(tokenExpiration[TokenType.REFRESH])
      })

      res.sendSuccess({ status: 201, message: 'success', data: authData.user, meta: null })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Handles the request to sign out a user.
   * 
   * @param {Request} req - The Express request object, containing the sign out data in the cookies.
   * @param {Response} res - The Express response object, used to send the response of the sign out operation.
   * @param {NextFunction} next - The Express next function, used to pass errors to the error handler.
   * @returns {Promise<void>} A promise that resolves to void.
   * @example
   * ```ts
   * const router = Router()
   * router.post('/sign-out', controller.signOut)
   * ```
  */
  public signOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user
      if (!userId) {
        throw new UnauthorizedError()
      }
      await this.useCase.signOut(userId.sub, req.cookies[cookieNames.REFRESH_TOKEN])

      res.clearCookie(cookieNames.ACCESS_TOKEN)
      res.clearCookie(cookieNames.REFRESH_TOKEN)

      res.sendSuccess({ status: 200, message: 'success', data: null, meta: null })
    } catch (error) {
      next(error)
    }
  }
}
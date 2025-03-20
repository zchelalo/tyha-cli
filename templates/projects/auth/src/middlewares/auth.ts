import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { cookieNames, userRoles } from 'src/config/constants'
import { tokenExpiration, TokenType, verifyJWT } from 'src/utils/jwt'
import { durationToMilliseconds } from 'src/utils/time_converter'

import { PostgresRepository as AuthPostgresRepository } from 'src/modules/auth/infrastructure/repositories/postgres'
import { PostgresRepository as UserPostgresRepository } from 'src/modules/user/infrastructure/repositories/postgres'
import { AuthUseCase } from 'src/modules/auth/application/use_cases/auth'

const authRepository = new AuthPostgresRepository()
const userRepository = new UserPostgresRepository()
const useCase = new AuthUseCase(authRepository, userRepository)

  /**
   * If the request contains an access token, it verifies the token and sets the user id in the request object. If the token is expired, it tries to refresh it using the refresh token. If the refresh token is missing, it sends an error response. If the refresh token is invalid, it sends an error response. If the access token is invalid, it sends an error response. If an error occurs, it passes the error to the error handler. This middleware must be used before any other middleware that requires authentication.
   * 
   * @param {Request} req - The Express request object, containing the access token and the refresh token.
   * @param {Response} res - The Express response object, used to send an error response.
   * @param {NextFunction} next - The Express next function, used to pass the error to the error handler if an error occurs or to pass the control to the next middleware.
   * @returns {Promise<void>} A promise that resolves to void.
   * @example
   * ```ts
   * const router = Router()
   * router.get('/protected', authMiddleware, controller.protected)
   * ```
  */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies[cookieNames.ACCESS_TOKEN]

  try {
    const payload = await verifyJWT(token, TokenType.ACCESS)
    req.user = {
      sub: payload.sub,
      role: payload.role
    }
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const refreshToken = req.cookies[cookieNames.REFRESH_TOKEN]
      if (!refreshToken) {
        res.sendError({ status: 401, message: 'unauthorized', details: { message: 'refresh token is missing' } })
        return 
      }

      try {
        const newTokens = await useCase.refreshAccessToken(refreshToken)
        res.cookie(cookieNames.ACCESS_TOKEN, newTokens.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: durationToMilliseconds(tokenExpiration[TokenType.REFRESH])
        })

        if (newTokens.refreshToken) {
          res.cookie(cookieNames.REFRESH_TOKEN, newTokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: durationToMilliseconds(tokenExpiration[TokenType.REFRESH])
          })
        }

        req.user = {
          sub: newTokens.payload.sub,
          role: newTokens.payload.role
        }

        next()
        return
      } catch (error) {
        next(error)
        return
      }
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.sendError({ status: 401, message: 'unauthorized', details: { message: error.message } })
      return
    }

    res.clearCookie(cookieNames.ACCESS_TOKEN)
    res.clearCookie(cookieNames.REFRESH_TOKEN)
    next(error)
  }
}

export function checkRoles(...roles: userRoles[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendError({ status: 401, message: 'unauthorized', details: { message: 'user is not authenticated' } })
      return
    }

    if (!roles.includes(req.user.role)) {
      res.sendError({ status: 403, message: 'forbidden', details: { message: 'user does not have permission to access this resource' } })
      return
    }

    next()
  }
}
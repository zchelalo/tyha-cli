import { Request, Response, NextFunction } from 'express'
import { UserUseCase } from 'src/modules/user/application/use_cases/user'

/**
 * UserController class.
 * 
 * This class handles HTTP requests related to user operations, such as retrieving user data, creating new users, and handling pagination.
*/
export class UserController {
  /**
   * An instance of the UserUseCase class, which contains the business logic.
   * @private
  */
  private readonly useCase: UserUseCase

  /**
   * Creates an instance of UserController.
   * 
   * @param {UserUseCase} useCase - The use case instance for handling user-related operations.
  */
  constructor(useCase: UserUseCase) {
    this.useCase = useCase
  }

  /**
   * Handles the request to get a user by their ID.
   * 
   * @param {Request} req - The Express request object, containing the user ID in params.
   * @param {Response} res - The Express response object, used to send the user data.
   * @param {NextFunction} next - The Express next function, used to pass errors to the error handler.
   * @returns {Promise<void>} A promise that resolves to void.
  */
  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const user = await this.useCase.getUserById(id)
      res.sendSuccess({ status: 200, message: 'success', data: user, meta: null })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Handles the request to get a list of users with pagination.
   * 
   * @param {Request} req - The Express request object, containing pagination data.
   * @param {Response} res - The Express response object, used to send the list of users.
   * @param {NextFunction} next - The Express next function, used to pass errors to the error handler.
   * @returns {Promise<void>} A promise that resolves to void.
  */
  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 0
      const limit = parseInt(req.query.limit as string) || 0

      const users = await this.useCase.getUsers(page, limit)

      res.sendSuccess({ status: 200, message: 'success', data: users.data, meta: users.meta })
    } catch (error) {
      next(error)
    }
  }


  /**
   * Handles the request to create a new user.
   * 
   * @param {Request} req - The Express request object, containing the new user data in the body.
   * @param {Response} res - The Express response object, used to send the created user data.
   * @param {NextFunction} next - The Express next function, used to pass errors to the error handler.
   * @returns {Promise<void>} A promise that resolves to void.
  */
  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.body
      const userCreated = await this.useCase.createUser(user)
      res.sendSuccess({ status: 201, message: 'success', data: userCreated, meta: null })
    } catch (error) {
      next(error)
    }
  }
}
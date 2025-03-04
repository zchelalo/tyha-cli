import { Request, Response, NextFunction } from 'express'
import { {{name}}UseCase } from 'src/modules/{{nameClean}}/application/use_cases/{{nameClean}}.js'

/**
 * {{name}}Controller class.
 * 
 * This class handles HTTP requests related to {{nameCamel}} operations, such as getById.
 * 
 * @link {{name}}UseCase - The use case class for {{nameCamel}} operations.
 * 
 * @example
 * ```ts
 * const {{nameCamel}}Repository = new {{name}}Repository()
 * const useCase = new {{name}}UseCase({{nameCamel}}Repository)
 * const controller = new {{name}}Controller(useCase)
 * ```
*/
export class {{name}}Controller {
  /**
   * An instance of the {{name}}UseCase class, which contains the business logic.
  */
  private readonly useCase: {{name}}UseCase

  /**
   * Creates an instance of AuthController.
   * 
   * @param useCase - The use case instance for handling {{nameCamel}}-related operations.
  */
  constructor(useCase: {{name}}UseCase) {
    this.useCase = useCase
  }

  /**
   * Handles the request to get a {{nameCamel}}.
   * 
   * @param {Request} req - The Express request object, containing the request data.
   * @param {Response} res - The Express response object, used to send the {{nameCamel}} data.
   * @param {NextFunction} next - The Express next function, used to pass errors to the error handler.
   * @example
   * ```ts
   * const router = Router()
   * router.get('/{{nameKebab}}', controller.getById)
   * ```
  */
  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 0
      const limit = parseInt(req.query.limit as string) || 0

      const {{nameCamel}}Data = await this.useCase.getById(page, limit)

      res.sendSuccess({ status: 200, message: 'success', data: {{nameCamel}}Data.{{nameCamel}}, meta: {{nameCamel}}Data.meta })
    } catch (error) {
      next(error)
    }
  }
}
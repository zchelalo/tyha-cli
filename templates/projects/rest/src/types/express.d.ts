import { Pagination } from 'src/utils/pagination.js'
import { SuccessResponse, ErrorResponse } from 'src/utils/response.js'

declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string
      }
    }
    interface Response {
      sendSuccess(response: SuccessResponse): this
      sendError(response: ErrorResponse): this
    }
  }
}
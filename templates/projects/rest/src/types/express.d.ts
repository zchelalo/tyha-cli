import { Pagination } from 'src/utils/pagination'
import { SuccessResponse, ErrorResponse } from 'src/utils/response'

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
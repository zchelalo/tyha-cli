import { Pagination } from 'src/utils/pagination'
import { SuccessResponse, ErrorResponse } from 'src/utils/response'

import { userRoles } from 'src/config/constants'

declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string
        role: userRoles
      }
    }
    interface Response {
      sendSuccess(response: SuccessResponse): this
      sendError(response: ErrorResponse): this
    }
  }
}
import { Pagination } from 'src/utils/pagination.js'
import { SuccessResponse, ErrorResponse } from 'src/utils/response.js'

import { userRoles } from 'src/config/constants.js'

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
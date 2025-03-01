/**
 * Custom error class. This class extends the Error class and adds a status code to the error object.
 * 
 * @class CustomError
 * @extends {Error}
 * @example
 * ```ts
 * throw new CustomError(500, 'internal server error')
 * ```
*/
export class CustomError extends Error {
  /**
   * @property {number} statusCode - HTTP status code of the error.
  */
  public statusCode: number
  
  /**
   * Creates an instance of CustomError.
   * 
   * @param {number} statusCode - HTTP status code of the error.
   * @param {string} message - Error message.
  */
  constructor(statusCode: number = 500, message: string) {
    super(message)
    this.statusCode = statusCode
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Error class BadRequestError that extend the CustomError class.
 * 
 * @extends {CustomError}
 * @example
 * ```ts
 * throw new BadRequestError('invalid email')
 * ```
*/
export class BadRequestError extends CustomError {

  /**
   * Creates an instance of BadRequestError.
   * 
   * @param {string} message - Error message.
  */
  constructor(message: string) {
    super(400, `Bad request: ${message}`) // 400 Bad Request
  }
}

/**
 * Error class UnauthorizedError that extend the CustomError class.
 * 
 * @extends {CustomError}
 * @example
 * ```ts
 * throw new UnauthorizedError()
 * ```
*/
export class UnauthorizedError extends CustomError {

  /**
   * Creates an instance of UnauthorizedError.
  */
  constructor() {
    super(401, 'Unauthorized') // 401 Unauthorized
  }
}

/**
 * Error class ForbiddenError that extend the CustomError class.
 * 
 * @extends {CustomError}
 * @example
 * ```ts
 * throw new ForbiddenError()
 * ```
*/
export class ForbiddenError extends CustomError {

  /**
   * Creates an instance of ForbiddenError.
  */
  constructor() {
    super(403, 'Forbidden') // 403 Forbidden
  }
}

/**
 * Error class NotFoundError that extend the CustomError class.
 * 
 * @extends {CustomError}
 * @example
 * ```ts
 * throw new NotFoundError('user')
 * ```
*/
export class NotFoundError extends CustomError {

  /**
   * Creates an instance of NotFoundError.
   * 
   * @param {string} resource - The resource that was not found.
  */
  constructor(resource: string) {
    super(404, `${resource} not found`) // 404 Not Found
  }
}

/**
 * Error class ConflictError that extend the CustomError class.
 * 
 * @extends {CustomError}
 * @example
 * ```ts
 * throw new ConflictError('email already exists')
 * ```
*/
export class ConflictError extends CustomError {

  /**
   * Creates an instance of ConflictError.
   * 
   * @param {string} message - Error message.
  */
  constructor(message: string) {
    super(409, `Conflict: ${message}`) // 409 Conflict
  }
}

/**
 * Error class InternalServerError that extend the CustomError class.
 * 
 * @extends {CustomError}
 * @example
 * ```ts
 * throw new InternalServerError('database error')
 * ```
*/
export class InternalServerError extends CustomError {

  /**
   * Creates an instance of InternalServerError.
   * 
   * @param {string} message - Error message.
  */
  constructor(message: string) {
    super(500, `Internal server error: ${message}`) // 500 Internal Server Error
  }
}

/**
 * Error class DatabaseError that extend the CustomError class.
 * 
 * @extends {CustomError}
 * @example
 * ```ts
 * throw new DatabaseError('connection failed')
 * ```
*/
export class DatabaseError extends CustomError {

  /**
   * Creates an instance of DatabaseError.
   * 
   * @param {string} message - Error message.
  */
  constructor(message: string) {
    super(500, `Database error: ${message}`) // 500 Internal Server Error
  }
}
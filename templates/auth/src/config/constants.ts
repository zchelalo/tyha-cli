/**
 * Constants for the cookie names used in the application.
 * 
 * @enum
*/
export enum cookieNames {
  /**
   * The name of the cookie that stores the refresh token.
  */
  REFRESH_TOKEN = 'refresh_token',

  /**
   * The name of the cookie that stores the access token.
  */
  ACCESS_TOKEN = 'access_token'
}

/**
 * Constants for the cronjob status values.
 * 
 * @enum
*/
export enum cronjobStatus {
  /**
   * The status of a successful cronjob run.
  */
  SUCCESS = 'success',

  /**
   * The status of a failed cronjob run.
  */
  ERROR = 'error'
}

/**
 * Constants for the user roles.
 * 
 * @enum
 */
export enum userRoles {
  /**
   * The role of an admin user.
   */
  ADMIN = 'admin',

  /**
   * The role of a regular user.
   */
  USER = 'user'
}
import { Meta } from 'src/helpers/meta'

/**
 * Data type for the response
 */
type Data = string | object

/**
 * Response type for the API
 * 
 * @interface
 * @param {number} status - Status code of the response
 * @param {string} message - Message of the response
 * @param {Data} data - Data of the response
 * @param {Meta} meta - Meta data of the response
 */
export interface SuccessResponse {
  status: number
  message: string
  data: Data | null
  meta: Meta | null
}

/**
 * Error response type for the API
 * 
 * @interface
 * @param {number} status - Status code of the response
 * @param {string} message - Message of the response
 * @param {object} details - Details of the response
 */
export interface ErrorResponse {
  status: number
  message: string
  details: object | null
}
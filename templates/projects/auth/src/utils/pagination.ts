/**
 * Pagination interface
 * 
 * @interface Pagination
 * @param {number} page - Current page
 * @param {number} limit - Number of items per page
 */
export interface Pagination {
  page: number
  limit: number
}
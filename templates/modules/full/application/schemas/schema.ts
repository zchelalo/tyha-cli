import { z } from 'zod'

/**
 * Get {{name}} schema
 * 
 * Represents the validation schema for get a {{name}} object by ID.
 * 
 * @param {string} id - The id of the {{nameCamel}}, must be a valid uuid.
 */
export const get{{name}}ByIDSchema = z.object({
  id: z.string().uuid()
})

/**
 * {{name}} pagination schema
 * 
 * Represents the validation schema for get the pagination to list {{name}} objects.
 * 
 * @param {number} page - The page of the pagination, must be a valid positive integer.
 * @param {number} limit - The limit of the pagination, must be a valid integer greater than zero.
 */
export const paginationSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1)
})
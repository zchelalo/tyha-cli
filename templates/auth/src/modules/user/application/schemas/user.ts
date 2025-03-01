import { z } from 'zod'

/**
 * User schema
 * 
 * Represents the validation schema for create a User object.
 * 
 * @param {string} name - The name of the user, must be a string, must be at least 3 characters.
 * @param {string} email - The email of the user, must be a valid email format.
 * @param {string} password - The password of the user, must be at least 8 characters.
 */
export const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(8)
})

/**
 * User schema
 * 
 * Represents the validation schema for get a User object by ID.
 * 
 * @param {string} id - The id of the user, must be a valid uuid.
 */
export const getUserByIDSchema = z.object({
  id: z.string().uuid()
})

/**
 * User schema
 * 
 * Represents the validation schema for get a User object by email.
 * 
 * @param {string} email - The email of the user, must be a valid email.
 */
export const getUserByEmailSchema = z.object({
  email: z.string().email()
})

/**
 * User schema
 * 
 * Represents the validation schema for get the pagination to get Users.
 * 
 * @param {number} offset - The offset of the pagination, must be a valid positive integer.
 * @param {number} limit - The limit of the pagination, must be a valid integer greater than zero.
 */
export const paginationSchema = z.object({
  offset: z.number().int().min(0),
  limit: z.number().int().min(1)
})
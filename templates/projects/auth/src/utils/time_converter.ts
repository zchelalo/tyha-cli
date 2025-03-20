import { InternalServerError } from 'src/helpers/errors/custom_error'

/**
 * Transform a duration string (in the format of 'Xm', 'Xh' or 'Xd') to milliseconds
 * 
 * @param {string} duration - Duration string
 * @returns {number} - Duration in milliseconds
 * @throws {InternalServerError} - If the duration format is invalid or the time unit is unknown
 * @example
 * ```ts
 * const duration = '15m'
 * const milliseconds = durationToMilliseconds(duration)
 * ```
 */
export const durationToMilliseconds = (duration: string): number => {
  const match = duration.match(/^(\d+)([mhd])$/)
  if (!match) {
    throw new InternalServerError('invalid duration format')
  }
  const value = parseInt(match[1], 10)
  const unit = match[2]
  
  switch (unit) {
    case 'm': // minutos
      return value * 60 * 1000
    case 'h': // horas
      return value * 60 * 60 * 1000
    case 'd': // días
      return value * 24 * 60 * 60 * 1000
    default:
      throw new InternalServerError('unknown time unit')
  }
}
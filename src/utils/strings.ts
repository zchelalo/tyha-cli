/**
 * Strings utility class
 */
export class Strings {
  /**
   * Capitalize the first letter of a string
   * @param str - String to capitalize
   * @returns Capitalized string
   */
  static fistLetterToUpperCase(str: string): string {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
  }

  /**
   * Convert a string to camelCase
   * @param str - String to convert, may contain dashes or underscores
   * @returns camelCase string
   */
  static camelCase(str: string): string {
    return str.replace(/[-_]([a-z])/g, (_, g1) => g1.toUpperCase())
  }

  /**
   * Convert a string to PascalCase
   * @param str - String to convert, may contain spaces
   * @returns PascalCase string
   */
  static pascalCase(str: string): string {
    return str.replace(/(\w)(\w*)/g, (_, g1, g2) => `${g1.toUpperCase()}${g2.toLowerCase()}`)
  }

  /**
   * Convert a string to kebab-case
   * @param str - String to convert, may contain spaces or camelCase
   * @returns kebab-case string
   */
  static kebabCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  }

  /**
   * Convert snake_case to normal text with spaces and first letter capitalized
   * @param str - String in snake_case
   * @returns Normalized string
   */
  static snakeToNormal(str: string): string {
    const formatted = str.replace(/_/g, ' ')
    return this.fistLetterToUpperCase(formatted)
  }

  /**
   * Clean a string to be used as a path
   * @param str - String to clean, may contain spaces or special characters
   * @returns Cleaned string
   */
  static clean(str: string): string {
    const noSpaces = str.trim().replace(/\s/g, '_')
    const cleaned = noSpaces.replace(/[^a-zA-Z0-9_]/g, '')
    return cleaned.toLowerCase()
  }
}
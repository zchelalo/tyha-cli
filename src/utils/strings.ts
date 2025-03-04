/**
 * Strings utility class
 */
export class Strings {
  /**
   * Capitalize the first letter of a string
   * @param str - String to capitalize
   * @returns Capitalized string
   */
  static firstLetterToUpperCase(str: string): string {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
  }

  /**
   * Convert a string to camelCase
   * @param str - String to convert, may contain spaces, dashes, or underscores
   * @returns camelCase string
   */
  static camelCase(str: string): string {
    return str
      .replace(/[-_\s]+(.)?/g, (_, g1) => (g1 ? g1.toUpperCase() : ''))
      .replace(/^([A-Z])/, g1 => g1.toLowerCase())
  }

  /**
   * Convert a string to PascalCase
   * @param str - String to convert, may contain spaces, dashes, or underscores
   * @returns PascalCase string
   */
  static pascalCase(str: string): string {
    return str
      .replace(/[-_\s]+(.)?/g, (_, g1) => (g1 ? g1.toUpperCase() : ''))
      .replace(/(^\w)/, g1 => g1.toUpperCase())
  }

  /**
   * Convert a string to kebab-case
   * @param str - String to convert, may contain spaces or camelCase
   * @returns kebab-case string
   */
  static kebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase()
  }

  /**
   * Convert snake_case to normal text with spaces and first letter capitalized
   * @param str - String in snake_case
   * @returns Normalized string
   */
  static snakeToNormal(str: string): string {
    return Strings.firstLetterToUpperCase(str.replace(/_/g, ' '))
  }

  /**
   * Clean a string to be used as a path
   * @param str - String to clean, may contain spaces or special characters
   * @returns Cleaned string
   */
  static clean(str: string): string {
    return str
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '')
      .toLowerCase()
  }
}
export class Strings {
  static fistLetterToUpperCase(str: string): string {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
  }

  static camelCase(str: string): string {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
  }

  static clean(str: string): string {
    const noSpaces = str.trim().replace(/\s/g, '_')
    return noSpaces.replace(/[^a-zA-Z0-9_]/g, '')
  }
}
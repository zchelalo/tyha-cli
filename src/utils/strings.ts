export class Strings {
  static fistLetterToUpperCase(str: string): string {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
  }

  static camelCase(str: string): string {
    return str.replace(/[-_]([a-z])/g, (_, g1) => g1.toUpperCase())
  }

  static pascalCase(str: string): string {
    return str.replace(/(\w)(\w*)/g, (_, g1, g2) => `${g1.toUpperCase()}${g2.toLowerCase()}`)
  }

  static clean(str: string): string {
    const noSpaces = str.trim().replace(/\s/g, '_')
    const cleaned = noSpaces.replace(/[^a-zA-Z0-9_]/g, '')
    return cleaned.toLowerCase()
  }
}
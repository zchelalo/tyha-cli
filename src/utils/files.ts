import fs from 'fs/promises'

export class Files {
  static async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath, fs.constants.F_OK)
      return true
    } catch (error) {
      return false
    }
  }

  static async readFile(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf-8')
    } catch (error) {
      throw error
    }
  }

  static async writeFile(filePath: string, data: string): Promise<void> {
    try {
      await fs.writeFile(filePath, data)
    } catch (error) {
      throw error
    }
  }

  static async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath)
    } catch (error) {
      throw error
    }
  }

  static async createDirectory(directoryPath: string): Promise<void> {
    try {
      await fs.mkdir(directoryPath)
    } catch (error) {
      throw error
    }
  }

  static async copyFile(sourcePath: string, destinationPath: string): Promise<void> {
    try {
      await fs.copyFile(sourcePath, destinationPath)
    } catch (error) {
      throw error
    }
  }

  static async copyDirectory(sourcePath: string, destinationPath: string): Promise<void> {
    try {
      await fs.cp(sourcePath, destinationPath, { recursive: true })
    } catch (error) {
      throw error
    }
  }
}
import fs from 'fs/promises'

/**
 * Class with static methods to work with files and directories
 */
export class Files {
  /**
   * Check if a file exists
   * @param filePath - Path to the file
   * @returns Promise with a boolean indicating if the file exists
   */
  static async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath, fs.constants.F_OK)
      return true
    } catch (error) {
      if (this.isError(error) && error.code === 'ENOENT') return false
      if (this.isError(error) && error.code === 'EACCES') throw new Error(`No tienes permisos para verificar la existencia del archivo en la ruta ${filePath}`)
      if (this.isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${filePath} es un directorio`)
      if (this.isError(error) && error.code === 'EPERM') throw new Error(`No tienes permisos para verificar la existencia del archivo en la ruta ${filePath}`)
      if (this.isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${filePath} es un directorio`)

      if (error instanceof Error) throw new Error(`Error al verificar la existencia del archivo: ${error.message}`)

      throw new Error('Error al verificar la existencia del archivo')
    }
  }

  /**
   * Check if a directory exists
   * @param directoryPath - Path to the directory
   * @returns Promise with a boolean indicating if the directory exists
   */
  static async directoryExists(directoryPath: string): Promise<boolean> {
    try {
      await fs.access(directoryPath, fs.constants.F_OK)
      return true
    } catch (error) {
      if (this.isError(error) && error.code === 'ENOENT') return false
      if (this.isError(error) && error.code === 'EACCES') throw new Error(`No tienes permisos para verificar la existencia del directorio en la ruta ${directoryPath}`)
      if (this.isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${directoryPath} es un archivo`)
      if (this.isError(error) && error.code === 'EPERM') throw new Error(`No tienes permisos para verificar la existencia del directorio en la ruta ${directoryPath}`)

      if (error instanceof Error) throw new Error(`Error al verificar la existencia del directorio: ${error.message}`)

      throw new Error('Error al verificar la existencia del directorio')    
    }
  }

  /**
   * Read a file
   * @param filePath - Path to the file
   * @returns Promise with the content of the file
   */
  static async readFile(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf-8')
    } catch (error) {
      if (this.isError(error) && error.code === 'ENOENT') throw new Error(`El archivo en la ruta ${filePath} no existe`)
      if (this.isError(error) && error.code === 'EACCES') throw new Error(`No tienes permisos para leer el archivo en la ruta ${filePath}`)
      if (this.isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${filePath} es un directorio`)
      if (this.isError(error) && error.code === 'EPERM') throw new Error(`No tienes permisos para leer el archivo en la ruta ${filePath}`)
      if (this.isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${filePath} es un directorio`)

      if (error instanceof Error) throw new Error(`Error al leer el archivo en la ruta ${filePath}: ${error.message}`)

      throw new Error('Error al leer el archivo')
    }
  }

  /**
   * Write a file
   * @param filePath - Path to the file
   * @param data - Data to write in the file
   */
  static async writeFile(filePath: string, data: string): Promise<void> {
    try {
      await fs.writeFile(filePath, data)
    } catch (error) {
      if (this.isError(error) && error.code === 'EACCES') throw new Error(`No tienes permisos para escribir en la ruta ${filePath}`)
      if (this.isError(error) && error.code === 'ENOENT') throw new Error(`El archivo en la ruta ${filePath} no existe`)
      if (this.isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${filePath} es un directorio`)
      if (this.isError(error) && error.code === 'EPERM') throw new Error(`No tienes permisos para escribir en la ruta ${filePath}`)
      if (this.isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${filePath} es un directorio`)

      if (error instanceof Error) throw new Error(`Error al escribir en el archivo en la ruta ${filePath}: ${error.message}`)

      throw new Error('Error al escribir en el archivo')
    }
  }

  /**
   * Delete a file
   * @param filePath - Path to the file
   */
  static async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath)
    } catch (error) {
      if (this.isError(error) && error.code === 'ENOENT') throw new Error(`El archivo en la ruta ${filePath} no existe`)
      if (this.isError(error) && error.code === 'EACCES') throw new Error(`No tienes permisos para eliminar el archivo en la ruta ${filePath}`)
      if (this.isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${filePath} es un directorio`)
      if (this.isError(error) && error.code === 'EPERM') throw new Error(`No tienes permisos para eliminar el archivo en la ruta ${filePath}`)
      if (this.isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${filePath} es un directorio`)

      if (error instanceof Error) throw new Error(`Error al eliminar el archivo en la ruta ${filePath}: ${error.message}`)

      throw new Error('Error al eliminar el archivo')
    }
  }

  /**
   * Create a directory
   * @param directoryPath - Path to the directory
   */
  static async createDirectory(directoryPath: string): Promise<void> {
    try {
      await fs.mkdir(directoryPath)
    } catch (error) {
      if (this.isError(error) && error.code === 'EACCES') throw new Error(`No tienes permisos para crear el directorio en la ruta ${directoryPath}`)
      if (this.isError(error) && error.code === 'EEXIST') throw new Error(`El directorio en la ruta ${directoryPath} ya existe`)
      if (this.isError(error) && error.code === 'ENOENT') throw new Error(`El directorio padre en la ruta ${directoryPath} no existe`)
      if (this.isError(error) && error.code === 'EPERM') throw new Error(`No tienes permisos para crear el directorio en la ruta ${directoryPath}`)
      if (this.isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${directoryPath} es un archivo`)

      if (error instanceof Error) throw new Error(`Error al crear el directorio en la ruta ${directoryPath}: ${error.message}`)

      throw new Error('Error al crear el directorio')
    }
  }

  /**
   * Copy a file
   * @param sourcePath - Path to the file
   * @param destinationPath - Path to the destination file
   */
  static async copyFile(sourcePath: string, destinationPath: string): Promise<void> {
    try {
      await fs.copyFile(sourcePath, destinationPath)
    } catch (error) {
      if (this.isError(error) && error.code === 'EACCES') throw new Error(`No tienes permisos para copiar el archivo en la ruta ${sourcePath}`)
      if (this.isError(error) && error.code === 'ENOENT') throw new Error(`El archivo en la ruta ${sourcePath} no existe`)
      if (this.isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${sourcePath} es un directorio`)
      if (this.isError(error) && error.code === 'ENOTDIR') throw new Error(`La ruta ${destinationPath} es un directorio`)
      if (this.isError(error) && error.code === 'EPERM') throw new Error(`No tienes permisos para copiar el archivo en la ruta ${destinationPath}`)

      if (error instanceof Error) throw new Error(`Error al copiar el archivo en la ruta ${sourcePath} a ${destinationPath}: ${error.message}`)

      throw new Error('Error al copiar el archivo')
    }
  }

  /**
   * Copy a directory
   * @param sourcePath - Path to the directory
   * @param destinationPath - Path to the destination directory
   */
  static async copyDirectory(sourcePath: string, destinationPath: string): Promise<void> {
    try {
      await fs.cp(sourcePath, destinationPath, { recursive: true })
    } catch (error) {
      if (this.isError(error) && error.code === 'EACCES') throw new Error(`Error al copiar el directorio en la ruta ${sourcePath}`)
      if (this.isError(error) && error.code === 'ENOENT') throw new Error(`El directorio en la ruta ${sourcePath} no existe`)
      if (this.isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${sourcePath} es un archivo`)
      if (this.isError(error) && error.code === 'ENOTDIR') throw new Error(`La ruta ${destinationPath} es un archivo`)
      if (this.isError(error) && error.code === 'EPERM') throw new Error(`No tienes permisos para copiar el directorio en la ruta ${destinationPath}`)
      if (this.isError(error) && error.code === 'EEXIST') throw new Error(`El directorio en la ruta ${destinationPath} ya existe`)

      if (error instanceof Error) throw new Error(`Error al copiar el directorio en la ruta ${sourcePath} a ${destinationPath}: ${error.message}`)

      throw new Error('Error al copiar el directorio')
    }
  }

  /**
   * Replace a value in a file
   * @param filePath - Path to the file
   * @param searchValue - Value to search
   * @param replaceValue - Value to replace
   */
  static async replaceInFile(filePath: string, searchValue: string, replaceValue: string): Promise<void> {
    try {
      let fileContent = await this.readFile(filePath)

      const safeSearchValue = this.escapeRegExp(searchValue)
      const regex = new RegExp(safeSearchValue, 'g')

      fileContent = fileContent.replace(regex, replaceValue)

      await this.writeFile(filePath, fileContent)
    } catch (error) {
      if (this.isError(error) && error.code === 'ENOENT') throw new Error(`El archivo en la ruta ${filePath} no existe`)
      if (this.isError(error) && error.code === 'EACCES') throw new Error(`No tienes permisos para leer el archivo en la ruta ${filePath}`)
      if (this.isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${filePath} es un directorio`)
      if (this.isError(error) && error.code === 'EPERM') throw new Error(`No tienes permisos para leer el archivo en la ruta ${filePath}`)

      if (error instanceof Error) throw new Error(`Error al reemplazar en el archivo en la ruta ${filePath}: ${error.message}`)

      throw new Error('Error al reemplazar en el archivo')
    }
  }

  /**
   * Rename a file
   * @param oldPath - Old path of the file
   * @param newPath - New path of the file
   */
  static async renameFile(oldPath: string, newPath: string): Promise<void> {
    try {
      await fs.rename(oldPath, newPath)
    } catch (error) {
      if (this.isError(error) && error.code === 'ENOENT') throw new Error(`El archivo en la ruta ${oldPath} no existe`)
      if (this.isError(error) && error.code === 'EACCES') throw new Error(`No tienes permisos para renombrar el archivo en la ruta ${oldPath}`)
      if (this.isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${oldPath} es un directorio`)
      if (this.isError(error) && error.code === 'EPERM') throw new Error(`No tienes permisos para renombrar el archivo en la ruta ${oldPath}`)

      if (error instanceof Error) throw new Error(`Error al renombrar el archivo en la ruta ${oldPath}: ${error.message}`)

      throw new Error('Error al renombrar el archivo')
    }
  }

  /**
   * Escape special characters in a string
   * @param text - Text to escape
   * @returns Text with special characters escaped
   */
  private static escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  /**
   * Check if an error is a NodeJS.ErrnoException
   * @param error - Error to check
   * @returns Boolean indicating if the error is a NodeJS.ErrnoException
   */
  private static isError(error: unknown): error is NodeJS.ErrnoException {
    return (error as NodeJS.ErrnoException).code !== undefined
  }
}
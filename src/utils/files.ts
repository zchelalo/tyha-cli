import fs from 'fs/promises'

function isError(error: unknown): error is NodeJS.ErrnoException {
  return (error as NodeJS.ErrnoException).code !== undefined
}

export class Files {
  static async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath, fs.constants.F_OK)
      return true
    } catch (error) {
      if (isError(error) && error.code === 'ENOENT') return false
      if (isError(error) && error.code === 'EACCES') throw new Error(`No tienes permisos para verificar la existencia del archivo en la ruta ${filePath}`)
      if (isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${filePath} es un directorio`)
      if (isError(error) && error.code === 'EPERM') throw new Error(`No tienes permisos para verificar la existencia del archivo en la ruta ${filePath}`)
      if (isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${filePath} es un directorio`)

      if (error instanceof Error) throw new Error(`Error al verificar la existencia del archivo: ${error.message}`)

      throw new Error('Error al verificar la existencia del archivo')
    }
  }

  static async readFile(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf-8')
    } catch (error) {
      if (isError(error) && error.code === 'ENOENT') throw new Error(`El archivo en la ruta ${filePath} no existe`)
      if (isError(error) && error.code === 'EACCES') throw new Error(`No tienes permisos para leer el archivo en la ruta ${filePath}`)
      if (isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${filePath} es un directorio`)
      if (isError(error) && error.code === 'EPERM') throw new Error(`No tienes permisos para leer el archivo en la ruta ${filePath}`)
      if (isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${filePath} es un directorio`)

      if (error instanceof Error) throw new Error(`Error al leer el archivo en la ruta ${filePath}: ${error.message}`)

      throw new Error('Error al leer el archivo')
    }
  }

  static async writeFile(filePath: string, data: string): Promise<void> {
    try {
      await fs.writeFile(filePath, data)
    } catch (error) {
      if (isError(error) && error.code === 'EACCES') throw new Error(`No tienes permisos para escribir en la ruta ${filePath}`)
      if (isError(error) && error.code === 'ENOENT') throw new Error(`El archivo en la ruta ${filePath} no existe`)
      if (isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${filePath} es un directorio`)
      if (isError(error) && error.code === 'EPERM') throw new Error(`No tienes permisos para escribir en la ruta ${filePath}`)
      if (isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${filePath} es un directorio`)

      if (error instanceof Error) throw new Error(`Error al escribir en el archivo en la ruta ${filePath}: ${error.message}`)

      throw new Error('Error al escribir en el archivo')
    }
  }

  static async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath)
    } catch (error) {
      if (isError(error) && error.code === 'ENOENT') throw new Error(`El archivo en la ruta ${filePath} no existe`)
      if (isError(error) && error.code === 'EACCES') throw new Error(`No tienes permisos para eliminar el archivo en la ruta ${filePath}`)
      if (isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${filePath} es un directorio`)
      if (isError(error) && error.code === 'EPERM') throw new Error(`No tienes permisos para eliminar el archivo en la ruta ${filePath}`)
      if (isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${filePath} es un directorio`)

      if (error instanceof Error) throw new Error(`Error al eliminar el archivo en la ruta ${filePath}: ${error.message}`)

      throw new Error('Error al eliminar el archivo')
    }
  }

  static async createDirectory(directoryPath: string): Promise<void> {
    try {
      await fs.mkdir(directoryPath)
    } catch (error) {
      if (isError(error) && error.code === 'EACCES') throw new Error(`No tienes permisos para crear el directorio en la ruta ${directoryPath}`)
      if (isError(error) && error.code === 'EEXIST') throw new Error(`El directorio en la ruta ${directoryPath} ya existe`)
      if (isError(error) && error.code === 'ENOENT') throw new Error(`El directorio padre en la ruta ${directoryPath} no existe`)
      if (isError(error) && error.code === 'EPERM') throw new Error(`No tienes permisos para crear el directorio en la ruta ${directoryPath}`)
      if (isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${directoryPath} es un archivo`)

      if (error instanceof Error) throw new Error(`Error al crear el directorio en la ruta ${directoryPath}: ${error.message}`)

      throw new Error('Error al crear el directorio')
    }
  }

  static async copyFile(sourcePath: string, destinationPath: string): Promise<void> {
    try {
      await fs.copyFile(sourcePath, destinationPath)
    } catch (error) {
      if (isError(error) && error.code === 'EACCES') throw new Error(`No tienes permisos para copiar el archivo en la ruta ${sourcePath}`)
      if (isError(error) && error.code === 'ENOENT') throw new Error(`El archivo en la ruta ${sourcePath} no existe`)
      if (isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${sourcePath} es un directorio`)
      if (isError(error) && error.code === 'ENOTDIR') throw new Error(`La ruta ${destinationPath} es un directorio`)
      if (isError(error) && error.code === 'EPERM') throw new Error(`No tienes permisos para copiar el archivo en la ruta ${destinationPath}`)

      if (error instanceof Error) throw new Error(`Error al copiar el archivo en la ruta ${sourcePath} a ${destinationPath}: ${error.message}`)

      throw new Error('Error al copiar el archivo')
    }
  }

  static async copyDirectory(sourcePath: string, destinationPath: string): Promise<void> {
    try {
      await fs.cp(sourcePath, destinationPath, { recursive: true })
    } catch (error) {
      if (isError(error) && error.code === 'EACCES') throw new Error(`Error al copiar el directorio en la ruta ${sourcePath}`)
      if (isError(error) && error.code === 'ENOENT') throw new Error(`El directorio en la ruta ${sourcePath} no existe`)
      if (isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${sourcePath} es un archivo`)
      if (isError(error) && error.code === 'ENOTDIR') throw new Error(`La ruta ${destinationPath} es un archivo`)
      if (isError(error) && error.code === 'EPERM') throw new Error(`No tienes permisos para copiar el directorio en la ruta ${destinationPath}`)
      if (isError(error) && error.code === 'EEXIST') throw new Error(`El directorio en la ruta ${destinationPath} ya existe`)

      if (error instanceof Error) throw new Error(`Error al copiar el directorio en la ruta ${sourcePath} a ${destinationPath}: ${error.message}`)

      throw new Error('Error al copiar el directorio')
    }
  }

  static async replaceInFile(filePath: string, searchValue: string, replaceValue: string): Promise<void> {
    try {
      let fileContent = await this.readFile(filePath)

      const safeSearchValue = escapeRegExp(searchValue)
      const regex = new RegExp(safeSearchValue, 'g')

      fileContent = fileContent.replace(regex, replaceValue)

      await this.writeFile(filePath, fileContent)
    } catch (error) {
      if (isError(error) && error.code === 'ENOENT') throw new Error(`El archivo en la ruta ${filePath} no existe`)
      if (isError(error) && error.code === 'EACCES') throw new Error(`No tienes permisos para leer el archivo en la ruta ${filePath}`)
      if (isError(error) && error.code === 'EISDIR') throw new Error(`La ruta ${filePath} es un directorio`)
      if (isError(error) && error.code === 'EPERM') throw new Error(`No tienes permisos para leer el archivo en la ruta ${filePath}`)

      if (error instanceof Error) throw new Error(`Error al reemplazar en el archivo en la ruta ${filePath}: ${error.message}`)

      throw new Error('Error al reemplazar en el archivo')
    }
  }
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
import { Command } from 'commander'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { join } from 'path'

import { MODULE_ROUTES, ModuleType, RepositoryType, RouterType, TEMPLATES } from 'src/config/constants.js'

import { Files } from 'src/utils/files.js'
import { Strings } from 'src/utils/strings.js'

interface Answers {
  name: string
  moduleType: ModuleType
  routerType: RouterType
  repositoryType: RepositoryType
}

export class CreateModule {
  private static modulePath: string
  private static nameEntity: string
  private static nameClean: string
  private static nameCamel: string
  private static nameKebab: string
  private static repositoryName: string
  private static repositoryClean: string

  /**
   * Create a module command
   * 
   * @returns The command
   */
  public static command(): Command {
    return new Command('create:module')
      .argument('[name]', 'Nombre del módulo')
      .description('Crea un nuevo modulo')
      .action(async (name: string | undefined) => {
        try {
          if (!name) {
            const nameAnswer = await inquirer.prompt<Answers>([
              { type: 'input', name: 'name', message: '¿Qué nombre tendrá el módulo?' },
            ])
            name = nameAnswer.name
          }

          const { moduleType } = await inquirer.prompt<Answers>([
            {
              type: 'list',
              name: 'moduleType',
              message: '¿Qué tipo de módulo quieres crear?',
              choices: [
                { name: 'Módulo con sus tres componentes (domain, application e infraestructura)', value: ModuleType.FULL },
                { name: 'Módulo con solo el dominio (útil cuando solo se desea crear la entidad)', value: ModuleType.ONLY_DOMAIN }
              ]
            }
          ])

          if (!await Files.directoryExists('src/modules')) {
            console.error(chalk.red(`Error: No se ha encontrado el directorio "src/modules".`))
            return
          }

          CreateModule.setNameVariations(name)

          if (await Files.directoryExists(CreateModule.modulePath)) {
            console.error(chalk.red(`Error: El módulo "${CreateModule.nameEntity}" ya existe.`))
            return
          }

          console.log(chalk.green(`Creando módulo "${CreateModule.nameEntity}" de tipo ${Strings.fistLetterToUpperCase(moduleType)}...`))
          await Files.copyDirectory(join(TEMPLATES, MODULE_ROUTES[moduleType]), CreateModule.modulePath)

          await CreateModule.modifyDomainFiles()
          if (moduleType === ModuleType.FULL) {
            await CreateModule.modifyApplicationFiles()
            await CreateModule.modifyInfrastructureFiles()
          }

          console.log(chalk.blue('Proyecto creado exitosamente'))
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error(chalk.red(`Error: ${error.message}`))
            return
          }
          console.error(chalk.red('Ha ocurrido un error inesperado.'))
        }
      })
  }

  private static async modifyDomainFiles() {
    await CreateModule.modifyFiles([
      join(CreateModule.modulePath, 'domain/entity.ts'),
      join(CreateModule.modulePath, 'domain/repository.ts'),
      join(CreateModule.modulePath, 'domain/value.ts')
    ])
  }

  private static async modifyApplicationFiles() {
    await CreateModule.modifyFiles([
      join(CreateModule.modulePath, 'application/dtos/create.ts'),
      join(CreateModule.modulePath, 'application/dtos/response.ts'),
      join(CreateModule.modulePath, 'application/schemas/schema.ts'),
      join(CreateModule.modulePath, 'application/use_cases/use_cases.ts')
    ])
  }

  private static async modifyInfrastructureFiles() {
    const { routerType, repositoryType } = await inquirer.prompt<Answers>([
      {
        type: 'list',
        name: 'routerType',
        message: '¿Qué tipo de router quieres crear?',
        choices: Object.values(RouterType).map(value => ({ name: Strings.snakeToNormal(value), value }))
      },
      {
        type: 'list',
        name: 'repositoryType',
        message: '¿Qué tipo de repositorio quieres crear?',
        choices: Object.values(RepositoryType).map(value => ({ name: Strings.snakeToNormal(value), value }))
      }
    ])

    const repositoryClean = Strings.clean(repositoryType)
    CreateModule.repositoryName = Strings.pascalCase(Strings.camelCase(repositoryClean))
    CreateModule.repositoryClean = repositoryClean

    const infraFiles: Record<string, string[]> = {
      [RepositoryType.DRIZZLE]: ['infrastructure/repositories/drizzle.ts'],
      [RepositoryType.IN_MEMORY]: ['infrastructure/repositories/memory.ts'],
      [RepositoryType.GRPC_CLIENT]: ['infrastructure/repositories/grpc.ts'],
      [RouterType.REST]: ['infrastructure/rest.ts', 'infrastructure/rest_controller.ts'],
      [RouterType.GRPC]: ['infrastructure/grpc.ts', 'infrastructure/grpc_controller.ts']
    }

    for (const type of [repositoryType, routerType]) {
      if (type) {
        await CreateModule.modifyFiles(infraFiles[type].map(file => join(CreateModule.modulePath, file)))
      }
    }

    await CreateModule.deleteUnnecessaryFiles(repositoryType, routerType)
  }

  private static async modifyFiles(files: string[]) {
    for (const filePath of files) {
      await CreateModule.replacePlaceholders(filePath)
      const newFileName = filePath.replace('schema.ts', `${CreateModule.nameClean}.ts`)
                                  .replace('use_cases.ts', `${CreateModule.nameClean}.ts`)
                                  .replace('create.ts', `${CreateModule.nameClean}_create.ts`)
                                  .replace('response.ts', `${CreateModule.nameClean}_response.ts`)
                                  .replace('rest.ts', `router.ts`)
                                  .replace('rest_controller.ts', `controller.ts`)
                                  .replace('grpc.ts', `router.ts`)
                                  .replace('grpc_controller.ts', `controller.ts`)
      await Files.renameFile(filePath, newFileName)
    }
  }

  private static async replacePlaceholders(filePath: string) {
    const replacements: Record<string, string> = {
      '{{name}}': CreateModule.nameEntity,
      '{{nameCamel}}': CreateModule.nameCamel,
      '{{nameKebab}}': CreateModule.nameKebab,
      '{{nameClean}}': CreateModule.nameClean,
      '{{repositoryName}}': CreateModule.repositoryName || '',
      '{{repositoryClean}}': CreateModule.repositoryClean || '',
    }

    for (const [placeholder, value] of Object.entries(replacements)) {
      await Files.replaceInFile(filePath, placeholder, value)
    }
  }

  private static setNameVariations(name: string) {
    const clean = Strings.clean(name)
    CreateModule.nameClean = clean
    CreateModule.nameCamel = Strings.camelCase(clean)
    CreateModule.nameKebab = Strings.kebabCase(CreateModule.nameCamel)
    CreateModule.nameEntity = Strings.pascalCase(CreateModule.nameCamel)
    CreateModule.modulePath = join('src/modules', clean)
  }

  private static async deleteUnnecessaryFiles(repositoryType: RepositoryType, routerType: RouterType) {
    const filesToDelete: string[] = []
  
    if (repositoryType !== RepositoryType.DRIZZLE) {
      filesToDelete.push(join(CreateModule.modulePath, 'infrastructure/repositories/drizzle.ts'))
    }
    if (repositoryType !== RepositoryType.IN_MEMORY) {
      filesToDelete.push(join(CreateModule.modulePath, 'infrastructure/repositories/memory.ts'))
    }
    if (repositoryType !== RepositoryType.GRPC_CLIENT) {
      filesToDelete.push(join(CreateModule.modulePath, 'infrastructure/repositories/grpc.ts'))
    }
    if (routerType !== RouterType.REST) {
      filesToDelete.push(join(CreateModule.modulePath, 'infrastructure/rest.ts'))
      filesToDelete.push(join(CreateModule.modulePath, 'infrastructure/rest_controller.ts'))
    }
    if (routerType !== RouterType.GRPC) {
      filesToDelete.push(join(CreateModule.modulePath, 'infrastructure/grpc.ts'))
      filesToDelete.push(join(CreateModule.modulePath, 'infrastructure/grpc_controller.ts'))
    }
  
    for (const filePath of filesToDelete) {
      if (await Files.fileExists(filePath)) {
        await Files.deleteFile(filePath)
      }
    }
  }
  
}
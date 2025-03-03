import { Command } from 'commander'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { join } from 'path'

import { MODULE_ROUTES, ModuleType, RepositoryType, RouterType, Template, TEMPLATES } from 'src/config/constants.js'

import { Files } from 'src/utils/files.js'
import { Strings } from 'src/utils/strings.js'

/**
 * Interface for the module name answer
 */
interface ModuleAnswer {
  /**
   * Module name
   */
  name: string
}

/**
 * Interface for the module type answer
 */
interface ModuleTypeAnswers {
  /**
   * Module type
   */
  moduleType: ModuleType
}

/**
 * Interface for the router type answer
 */
interface RouterTypeAnswers {
  /**
   * Router type
   */
  routerType: RouterType
}

/**
 * Interface for the repository type answer
 */
interface RepositoryTypeAnswers {
  /**
   * Repository type
   */
  repositoryType: RepositoryType
}

export class CreateModule {
  private static modulePath: string
  private static nameEntity: string
  private static nameClean: string
  private static nameCamel: string

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
            const nameAnswer = await inquirer.prompt<ModuleAnswer>([
              { type: 'input', name: 'name', message: '¿Qué nombre tendrá el módulo?' },
            ])
            name = nameAnswer.name
          }

          const moduleTypeAnswers = await inquirer.prompt<ModuleTypeAnswers>([
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
          const moduleType = moduleTypeAnswers.moduleType

          if (!await Files.directoryExists('src/modules')) {
            console.error(chalk.red(`Error: No se ha encontrado el directorio "src/modules".`))
            return
          }

          CreateModule.nameClean = Strings.clean(name)
          CreateModule.nameCamel = Strings.camelCase(CreateModule.nameClean)
          CreateModule.nameEntity = Strings.pascalCase(CreateModule.nameCamel)
          CreateModule.modulePath = join('src/modules', CreateModule.nameClean)

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
    const entityPath = join(CreateModule.modulePath, 'domain/entity.ts')
    const repositoryPath = join(CreateModule.modulePath, 'domain/repository.ts')
    const valuePath = join(CreateModule.modulePath, 'domain/value.ts')

    // entity
    await Files.replaceInFile(entityPath, '{{name}}', CreateModule.nameEntity)
    await Files.replaceInFile(entityPath, '{{nameCamel}}', CreateModule.nameCamel)

    // repository
    await Files.replaceInFile(repositoryPath, '{{name}}', CreateModule.nameEntity)
    await Files.replaceInFile(repositoryPath, '{{nameClean}}', CreateModule.nameClean)
    await Files.replaceInFile(repositoryPath, '{{nameCamel}}', CreateModule.nameCamel)

    // value
    await Files.replaceInFile(valuePath, '{{name}}', CreateModule.nameEntity)
    await Files.replaceInFile(valuePath, '{{nameClean}}', CreateModule.nameClean)
    await Files.replaceInFile(valuePath, '{{nameCamel}}', CreateModule.nameCamel)
  }

  private static async modifyApplicationFiles() {
    const dtoCreatePath = join(CreateModule.modulePath, 'application/dtos/create.ts')
    const dtoResponsePath = join(CreateModule.modulePath, 'application/dtos/response.ts')
    const schemaPath = join(CreateModule.modulePath, 'application/schemas/schema.ts')
    const useCasesPath = join(CreateModule.modulePath, 'application/use_cases/use_cases.ts')

    // dtos
    await Files.replaceInFile(dtoCreatePath, '{{name}}', CreateModule.nameEntity)
    await Files.replaceInFile(dtoCreatePath, '{{nameClean}}', CreateModule.nameClean)
    await Files.replaceInFile(dtoCreatePath, '{{nameCamel}}', CreateModule.nameCamel)
    await Files.replaceInFile(dtoResponsePath, '{{name}}', CreateModule.nameEntity)
    await Files.replaceInFile(dtoResponsePath, '{{nameClean}}', CreateModule.nameClean)
    await Files.replaceInFile(dtoResponsePath, '{{nameCamel}}', CreateModule.nameCamel)

    await Files.renameFile(dtoCreatePath, join(CreateModule.modulePath, `application/dtos/${CreateModule.nameClean}_create.ts`))
    await Files.renameFile(dtoResponsePath, join(CreateModule.modulePath, `application/dtos/${CreateModule.nameClean}_response.ts`))

    // schemas
    await Files.replaceInFile(schemaPath, '{{name}}', CreateModule.nameEntity)
    await Files.replaceInFile(schemaPath, '{{nameCamel}}', CreateModule.nameCamel)

    await Files.renameFile(schemaPath, join(CreateModule.modulePath, `application/schemas/${CreateModule.nameClean}.ts`))

    // use cases
    await Files.replaceInFile(useCasesPath, '{{name}}', CreateModule.nameEntity)
    await Files.replaceInFile(useCasesPath, '{{nameClean}}', CreateModule.nameClean)
    await Files.replaceInFile(useCasesPath, '{{nameCamel}}', CreateModule.nameCamel)

    await Files.renameFile(useCasesPath, join(CreateModule.modulePath, `application/use_cases/${CreateModule.nameClean}.ts`))
  }

  private static async modifyInfrastructureFiles() {
    CreateModule.modifyRouterFiles()
    CreateModule.modifyRepositoryFiles()
  }

  private static async modifyRouterFiles() {
    const routerTypeAnswer = await inquirer.prompt<RouterTypeAnswers>([
      {
        type: 'list',
        name: 'routerType',
        message: '¿Qué tipo de router quieres crear?',
        choices: [
          { name: 'REST Router', value: RouterType.REST },
          { name: 'gRPC Router', value: RouterType.GRPC }
        ]
      }
    ])
    const routerType = routerTypeAnswer.routerType

    const restRouterPath = join(CreateModule.modulePath, 'infrastructure/rest.ts')
    const restControllerPath = join(CreateModule.modulePath, 'infrastructure/rest_controller.ts')
    const grpcRouterPath = join(CreateModule.modulePath, 'infrastructure/grpc.ts')
    const grpcControllerPath = join(CreateModule.modulePath, 'infrastructure/grpc_controller.ts')

    switch (routerType) {
      case RouterType.REST:
        await Files.replaceInFile(restRouterPath, '{{name}}', CreateModule.nameEntity)
        await Files.replaceInFile(restRouterPath, '{{nameClean}}', CreateModule.nameClean)
        await Files.replaceInFile(restRouterPath, '{{nameCamel}}', CreateModule.nameCamel)

        await Files.replaceInFile(restControllerPath, '{{nameCamel}}', CreateModule.nameCamel)
        await Files.replaceInFile(restControllerPath, '{{nameCamel}}', CreateModule.nameCamel)
        await Files.replaceInFile(restControllerPath, '{{nameCamel}}', CreateModule.nameCamel)

        await Files.renameFile(restControllerPath, join(CreateModule.modulePath, 'infrastructure/controller.ts'))

        await Files.deleteFile(grpcRouterPath)
        await Files.deleteFile(grpcControllerPath)
        break;
      case RouterType.REST:
        await Files.replaceInFile(grpcRouterPath, '{{name}}', CreateModule.nameEntity)
        await Files.replaceInFile(grpcRouterPath, '{{nameClean}}', CreateModule.nameClean)
        await Files.replaceInFile(grpcRouterPath, '{{nameCamel}}', CreateModule.nameCamel)

        await Files.replaceInFile(grpcControllerPath, '{{nameCamel}}', CreateModule.nameCamel)
        await Files.replaceInFile(grpcControllerPath, '{{nameCamel}}', CreateModule.nameCamel)
        await Files.replaceInFile(grpcControllerPath, '{{nameCamel}}', CreateModule.nameCamel)

        await Files.renameFile(grpcControllerPath, join(CreateModule.modulePath, 'infrastructure/controller.ts'))

        await Files.deleteFile(restRouterPath)
        await Files.deleteFile(restControllerPath)
        break;
      default:
        await Files.deleteFile(grpcRouterPath)
        await Files.deleteFile(grpcControllerPath)
        await Files.deleteFile(restRouterPath)
        await Files.deleteFile(restControllerPath)
        break;
    }
  }

  private static async modifyRepositoryFiles() {
    const repositoryTypeAnswer = await inquirer.prompt<RepositoryTypeAnswers>([
      {
        type: 'list',
        name: 'repositoryType',
        message: '¿Qué tipo de router quieres crear?',
        choices: [
          { name: 'Drizzle ORM', value: RepositoryType.DRIZZLE },
          { name: 'In memory', value: RepositoryType.IN_MEMORY },
          { name: 'gRPC Client', value: RepositoryType.GRPC_CLIENT }
        ]
      }
    ])
    const repositoryType = repositoryTypeAnswer.repositoryType

    const drizzleRepositoryPath = join(CreateModule.modulePath, 'infrastructure/repositories/drizzle.ts')
    const memoryRepositoryPath = join(CreateModule.modulePath, 'infrastructure/repositories/memory.ts')
    const grpcRepositoryPath = join(CreateModule.modulePath, 'infrastructure/repositories/grpc.ts')

    switch (repositoryType) {
      case RepositoryType.DRIZZLE:
        await Files.replaceInFile(drizzleRepositoryPath, '{{name}}', CreateModule.nameEntity)
        await Files.replaceInFile(drizzleRepositoryPath, '{{nameClean}}', CreateModule.nameClean)
        await Files.replaceInFile(drizzleRepositoryPath, '{{nameCamel}}', CreateModule.nameCamel)

        await Files.deleteFile(grpcRepositoryPath)
        await Files.deleteFile(memoryRepositoryPath)
        break;
      case RepositoryType.IN_MEMORY:
        await Files.replaceInFile(memoryRepositoryPath, '{{name}}', CreateModule.nameEntity)
        await Files.replaceInFile(memoryRepositoryPath, '{{nameClean}}', CreateModule.nameClean)
        await Files.replaceInFile(memoryRepositoryPath, '{{nameCamel}}', CreateModule.nameCamel)

        await Files.deleteFile(grpcRepositoryPath)
        await Files.deleteFile(drizzleRepositoryPath)
        break;
      case RepositoryType.GRPC_CLIENT:
        await Files.replaceInFile(grpcRepositoryPath, '{{name}}', CreateModule.nameEntity)
        await Files.replaceInFile(grpcRepositoryPath, '{{nameClean}}', CreateModule.nameClean)
        await Files.replaceInFile(grpcRepositoryPath, '{{nameCamel}}', CreateModule.nameCamel)

        await Files.deleteFile(drizzleRepositoryPath)
        await Files.deleteFile(memoryRepositoryPath)
        break;
      default:
        await Files.deleteFile(memoryRepositoryPath)
        await Files.deleteFile(drizzleRepositoryPath)
        await Files.deleteFile(grpcRepositoryPath)
        break;
    }
  }
}
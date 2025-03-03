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
    // Replace placeholders in domain layer files
    // entity
    await Files.replaceInFile(join(CreateModule.modulePath, 'domain/entity.ts'), '{{name}}', CreateModule.nameEntity)
    await Files.replaceInFile(join(CreateModule.modulePath, 'domain/entity.ts'), '{{CreateModule.nameCamel}}', CreateModule.nameCamel)

    // repository
    await Files.replaceInFile(join(CreateModule.modulePath, 'domain/repository.ts'), '{{name}}', CreateModule.nameEntity)
    await Files.replaceInFile(join(CreateModule.modulePath, 'domain/repository.ts'), '{{CreateModule.nameClean}}', CreateModule.nameClean)
    await Files.replaceInFile(join(CreateModule.modulePath, 'domain/repository.ts'), '{{CreateModule.nameCamel}}', CreateModule.nameCamel)

    // value
    await Files.replaceInFile(join(CreateModule.modulePath, 'domain/value.ts'), '{{name}}', CreateModule.nameEntity)
    await Files.replaceInFile(join(CreateModule.modulePath, 'domain/value.ts'), '{{CreateModule.nameClean}}', CreateModule.nameClean)
    await Files.replaceInFile(join(CreateModule.modulePath, 'domain/value.ts'), '{{CreateModule.nameCamel}}', CreateModule.nameCamel)
  }

  private static async modifyApplicationFiles() {
    // Replace placeholders in application layer files
    // dtos
    await Files.replaceInFile(join(CreateModule.modulePath, 'application/dtos/create.ts'), '{{name}}', CreateModule.nameEntity)
    await Files.replaceInFile(join(CreateModule.modulePath, 'application/dtos/create.ts'), '{{CreateModule.nameClean}}', CreateModule.nameClean)
    await Files.replaceInFile(join(CreateModule.modulePath, 'application/dtos/create.ts'), '{{CreateModule.nameCamel}}', CreateModule.nameCamel)
    await Files.replaceInFile(join(CreateModule.modulePath, 'application/dtos/response.ts'), '{{name}}', CreateModule.nameEntity)
    await Files.replaceInFile(join(CreateModule.modulePath, 'application/dtos/response.ts'), '{{CreateModule.nameClean}}', CreateModule.nameClean)
    await Files.replaceInFile(join(CreateModule.modulePath, 'application/dtos/response.ts'), '{{CreateModule.nameCamel}}', CreateModule.nameCamel)

    await Files.renameFile(join(CreateModule.modulePath, 'application/dtos/create.ts'), join(CreateModule.modulePath, `application/dtos/${CreateModule.nameClean}_create.ts`))
    await Files.renameFile(join(CreateModule.modulePath, 'application/dtos/response.ts'), join(CreateModule.modulePath, `application/dtos/${CreateModule.nameClean}_response.ts`))

    // schemas
    await Files.replaceInFile(join(CreateModule.modulePath, 'application/schemas/schema.ts'), '{{name}}', CreateModule.nameEntity)
    await Files.replaceInFile(join(CreateModule.modulePath, 'application/schemas/schema.ts'), '{{CreateModule.nameCamel}}', CreateModule.nameCamel)

    await Files.renameFile(join(CreateModule.modulePath, 'application/schemas/schema.ts'), join(CreateModule.modulePath, `application/schemas/${CreateModule.nameClean}.ts`))

    // use cases
    await Files.replaceInFile(join(CreateModule.modulePath, 'application/use_cases/use_cases.ts'), '{{name}}', CreateModule.nameEntity)
    await Files.replaceInFile(join(CreateModule.modulePath, 'application/use_cases/use_cases.ts'), '{{CreateModule.nameClean}}', CreateModule.nameClean)
    await Files.replaceInFile(join(CreateModule.modulePath, 'application/use_cases/use_cases.ts'), '{{CreateModule.nameCamel}}', CreateModule.nameCamel)

    await Files.renameFile(join(CreateModule.modulePath, 'application/use_cases/use_cases.ts'), join(CreateModule.modulePath, `application/use_cases/${CreateModule.nameClean}.ts`))
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

    switch (routerType) {
      case RouterType.REST:
        await Files.replaceInFile(join(CreateModule.modulePath, 'infrastructure/rest.ts'), '{{name}}', CreateModule.nameEntity)
        await Files.replaceInFile(join(CreateModule.modulePath, 'infrastructure/rest.ts'), '{{CreateModule.nameClean}}', CreateModule.nameClean)
        await Files.replaceInFile(join(CreateModule.modulePath, 'infrastructure/rest.ts'), '{{CreateModule.nameCamel}}', CreateModule.nameCamel)

        await Files.replaceInFile(join(CreateModule.modulePath, 'infrastructure/rest_controller.ts'), '{{CreateModule.nameCamel}}', CreateModule.nameCamel)
        await Files.replaceInFile(join(CreateModule.modulePath, 'infrastructure/rest_controller.ts'), '{{CreateModule.nameCamel}}', CreateModule.nameCamel)
        await Files.replaceInFile(join(CreateModule.modulePath, 'infrastructure/rest_controller.ts'), '{{CreateModule.nameCamel}}', CreateModule.nameCamel)

        await Files.renameFile(join(CreateModule.modulePath, 'infrastructure/rest_controller.ts'), join(CreateModule.modulePath, 'infrastructure/controller.ts'))

        await Files.deleteFile(join(CreateModule.modulePath, 'infrastructure/grpc.ts'))
        await Files.deleteFile(join(CreateModule.modulePath, 'infrastructure/grpc_controller.ts'))
        break;
      case RouterType.REST:
        await Files.replaceInFile(join(CreateModule.modulePath, 'infrastructure/grpc.ts'), '{{name}}', CreateModule.nameEntity)
        await Files.replaceInFile(join(CreateModule.modulePath, 'infrastructure/grpc.ts'), '{{CreateModule.nameClean}}', CreateModule.nameClean)
        await Files.replaceInFile(join(CreateModule.modulePath, 'infrastructure/grpc.ts'), '{{CreateModule.nameCamel}}', CreateModule.nameCamel)

        await Files.replaceInFile(join(CreateModule.modulePath, 'infrastructure/grpc_controller.ts'), '{{CreateModule.nameCamel}}', CreateModule.nameCamel)
        await Files.replaceInFile(join(CreateModule.modulePath, 'infrastructure/grpc_controller.ts'), '{{CreateModule.nameCamel}}', CreateModule.nameCamel)
        await Files.replaceInFile(join(CreateModule.modulePath, 'infrastructure/grpc_controller.ts'), '{{CreateModule.nameCamel}}', CreateModule.nameCamel)

        await Files.renameFile(join(CreateModule.modulePath, 'infrastructure/grpc_controller.ts'), join(CreateModule.modulePath, 'infrastructure/controller.ts'))

        await Files.deleteFile(join(CreateModule.modulePath, 'infrastructure/rest.ts'))
        await Files.deleteFile(join(CreateModule.modulePath, 'infrastructure/rest_controller.ts'))
        break;
      default:
        await Files.deleteFile(join(CreateModule.modulePath, 'infrastructure/grpc.ts'))
        await Files.deleteFile(join(CreateModule.modulePath, 'infrastructure/grpc_controller.ts'))
        await Files.deleteFile(join(CreateModule.modulePath, 'infrastructure/rest.ts'))
        await Files.deleteFile(join(CreateModule.modulePath, 'infrastructure/rest_controller.ts'))
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

    switch (repositoryType) {
      case RepositoryType.DRIZZLE:
        await Files.replaceInFile(join(CreateModule.modulePath, 'infrastructure/repositories/drizzle.ts'), '{{name}}', CreateModule.nameEntity)
        await Files.replaceInFile(join(CreateModule.modulePath, 'infrastructure/repositories/drizzle.ts'), '{{CreateModule.nameClean}}', CreateModule.nameClean)
        await Files.replaceInFile(join(CreateModule.modulePath, 'infrastructure/repositories/drizzle.ts'), '{{CreateModule.nameCamel}}', CreateModule.nameCamel)

        await Files.deleteFile(join(CreateModule.modulePath, 'infrastructure/repositories/grpc.ts'))
        await Files.deleteFile(join(CreateModule.modulePath, 'infrastructure/repositories/memory.ts'))
        break;
      case RepositoryType.IN_MEMORY:
        await Files.replaceInFile(join(CreateModule.modulePath, 'infrastructure/repositories/memory.ts'), '{{name}}', CreateModule.nameEntity)
        await Files.replaceInFile(join(CreateModule.modulePath, 'infrastructure/repositories/memory.ts'), '{{CreateModule.nameClean}}', CreateModule.nameClean)
        await Files.replaceInFile(join(CreateModule.modulePath, 'infrastructure/repositories/memory.ts'), '{{CreateModule.nameCamel}}', CreateModule.nameCamel)

        await Files.deleteFile(join(CreateModule.modulePath, 'infrastructure/repositories/grpc.ts'))
        await Files.deleteFile(join(CreateModule.modulePath, 'infrastructure/repositories/drizzle.ts'))
        break;
      case RepositoryType.GRPC_CLIENT:
        await Files.replaceInFile(join(CreateModule.modulePath, 'infrastructure/repositories/grpc.ts'), '{{name}}', CreateModule.nameEntity)
        await Files.replaceInFile(join(CreateModule.modulePath, 'infrastructure/repositories/grpc.ts'), '{{CreateModule.nameClean}}', CreateModule.nameClean)
        await Files.replaceInFile(join(CreateModule.modulePath, 'infrastructure/repositories/grpc.ts'), '{{CreateModule.nameCamel}}', CreateModule.nameCamel)

        await Files.deleteFile(join(CreateModule.modulePath, 'infrastructure/repositories/drizzle.ts'))
        await Files.deleteFile(join(CreateModule.modulePath, 'infrastructure/repositories/memory.ts'))
        break;
      default:
        await Files.deleteFile(join(CreateModule.modulePath, 'infrastructure/repositories/memory.ts'))
        await Files.deleteFile(join(CreateModule.modulePath, 'infrastructure/repositories/drizzle.ts'))
        await Files.deleteFile(join(CreateModule.modulePath, 'infrastructure/repositories/grpc.ts'))
        break;
    }
  }
}
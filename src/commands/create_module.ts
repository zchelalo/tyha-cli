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

/**
 * Create a module command
 * 
 * @returns The command
 */
export function createModule() {
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

        const nameClean = Strings.clean(name)
        const nameCamel = Strings.camelCase(nameClean)
        const nameEntity = Strings.pascalCase(nameCamel)
        const modulePath = join('src/modules', nameClean)

        if (await Files.directoryExists(modulePath)) {
          console.error(chalk.red(`Error: El módulo "${nameEntity}" ya existe.`))
          return
        }

        console.log(chalk.green(`Creando módulo "${nameEntity}" de tipo ${Strings.fistLetterToUpperCase(moduleType)}...`))
        await Files.copyDirectory(join(TEMPLATES, MODULE_ROUTES[moduleType]), modulePath)

        // Replace placeholders in domain layer files
        // entity
        await Files.replaceInFile(join(modulePath, 'domain/entity.ts'), '{{name}}', nameEntity)
        await Files.replaceInFile(join(modulePath, 'domain/entity.ts'), '{{nameCamel}}', nameCamel)

        // repository
        await Files.replaceInFile(join(modulePath, 'domain/repository.ts'), '{{name}}', nameEntity)
        await Files.replaceInFile(join(modulePath, 'domain/repository.ts'), '{{nameClean}}', nameClean)
        await Files.replaceInFile(join(modulePath, 'domain/repository.ts'), '{{nameCamel}}', nameCamel)

        // value
        await Files.replaceInFile(join(modulePath, 'domain/value.ts'), '{{name}}', nameEntity)
        await Files.replaceInFile(join(modulePath, 'domain/value.ts'), '{{nameClean}}', nameClean)
        await Files.replaceInFile(join(modulePath, 'domain/value.ts'), '{{nameCamel}}', nameCamel)

        // Replace placeholders in application layer files
        // dtos
        await Files.replaceInFile(join(modulePath, 'application/dtos/create.ts'), '{{name}}', nameEntity)
        await Files.replaceInFile(join(modulePath, 'application/dtos/create.ts'), '{{nameClean}}', nameClean)
        await Files.replaceInFile(join(modulePath, 'application/dtos/create.ts'), '{{nameCamel}}', nameCamel)
        await Files.replaceInFile(join(modulePath, 'application/dtos/response.ts'), '{{name}}', nameEntity)
        await Files.replaceInFile(join(modulePath, 'application/dtos/response.ts'), '{{nameClean}}', nameClean)
        await Files.replaceInFile(join(modulePath, 'application/dtos/response.ts'), '{{nameCamel}}', nameCamel)

        await Files.renameFile(join(modulePath, 'application/dtos/create.ts'), join(modulePath, `application/dtos/${nameClean}_create.ts`))
        await Files.renameFile(join(modulePath, 'application/dtos/response.ts'), join(modulePath, `application/dtos/${nameClean}_response.ts`))

        // schemas
        await Files.replaceInFile(join(modulePath, 'application/schemas/schema.ts'), '{{name}}', nameEntity)
        await Files.replaceInFile(join(modulePath, 'application/schemas/schema.ts'), '{{nameCamel}}', nameCamel)

        await Files.renameFile(join(modulePath, 'application/schemas/schema.ts'), join(modulePath, `application/schemas/${nameClean}.ts`))

        // use cases
        await Files.replaceInFile(join(modulePath, 'application/use_cases/use_cases.ts'), '{{name}}', nameEntity)
        await Files.replaceInFile(join(modulePath, 'application/use_cases/use_cases.ts'), '{{nameClean}}', nameClean)
        await Files.replaceInFile(join(modulePath, 'application/use_cases/use_cases.ts'), '{{nameCamel}}', nameCamel)

        await Files.renameFile(join(modulePath, 'application/use_cases/use_cases.ts'), join(modulePath, `application/use_cases/${nameClean}.ts`))

        if (moduleType === ModuleType.FULL) {
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
              await Files.replaceInFile(join(modulePath, 'infrastructure/rest.ts'), '{{name}}', nameEntity)
              await Files.replaceInFile(join(modulePath, 'infrastructure/rest.ts'), '{{nameClean}}', nameClean)
              await Files.replaceInFile(join(modulePath, 'infrastructure/rest.ts'), '{{nameCamel}}', nameCamel)

              await Files.replaceInFile(join(modulePath, 'infrastructure/rest_controller.ts'), '{{nameCamel}}', nameCamel)
              await Files.replaceInFile(join(modulePath, 'infrastructure/rest_controller.ts'), '{{nameCamel}}', nameCamel)
              await Files.replaceInFile(join(modulePath, 'infrastructure/rest_controller.ts'), '{{nameCamel}}', nameCamel)

              await Files.renameFile(join(modulePath, 'infrastructure/rest_controller.ts'), join(modulePath, 'infrastructure/controller.ts'))

              await Files.deleteFile(join(modulePath, 'infrastructure/grpc.ts'))
              await Files.deleteFile(join(modulePath, 'infrastructure/grpc_controller.ts'))
              break;
            case RouterType.REST:
              await Files.replaceInFile(join(modulePath, 'infrastructure/grpc.ts'), '{{name}}', nameEntity)
              await Files.replaceInFile(join(modulePath, 'infrastructure/grpc.ts'), '{{nameClean}}', nameClean)
              await Files.replaceInFile(join(modulePath, 'infrastructure/grpc.ts'), '{{nameCamel}}', nameCamel)

              await Files.replaceInFile(join(modulePath, 'infrastructure/grpc_controller.ts'), '{{nameCamel}}', nameCamel)
              await Files.replaceInFile(join(modulePath, 'infrastructure/grpc_controller.ts'), '{{nameCamel}}', nameCamel)
              await Files.replaceInFile(join(modulePath, 'infrastructure/grpc_controller.ts'), '{{nameCamel}}', nameCamel)

              await Files.renameFile(join(modulePath, 'infrastructure/grpc_controller.ts'), join(modulePath, 'infrastructure/controller.ts'))

              await Files.deleteFile(join(modulePath, 'infrastructure/rest.ts'))
              await Files.deleteFile(join(modulePath, 'infrastructure/rest_controller.ts'))
              break;
            default:
              await Files.deleteFile(join(modulePath, 'infrastructure/grpc.ts'))
              await Files.deleteFile(join(modulePath, 'infrastructure/grpc_controller.ts'))
              await Files.deleteFile(join(modulePath, 'infrastructure/rest.ts'))
              await Files.deleteFile(join(modulePath, 'infrastructure/rest_controller.ts'))
              break;
          }

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
              await Files.replaceInFile(join(modulePath, 'infrastructure/repositories/drizzle.ts'), '{{name}}', nameEntity)
              await Files.replaceInFile(join(modulePath, 'infrastructure/repositories/drizzle.ts'), '{{nameClean}}', nameClean)
              await Files.replaceInFile(join(modulePath, 'infrastructure/repositories/drizzle.ts'), '{{nameCamel}}', nameCamel)

              await Files.deleteFile(join(modulePath, 'infrastructure/repositories/grpc.ts'))
              await Files.deleteFile(join(modulePath, 'infrastructure/repositories/memory.ts'))
              break;
            case RepositoryType.IN_MEMORY:
              await Files.replaceInFile(join(modulePath, 'infrastructure/repositories/memory.ts'), '{{name}}', nameEntity)
              await Files.replaceInFile(join(modulePath, 'infrastructure/repositories/memory.ts'), '{{nameClean}}', nameClean)
              await Files.replaceInFile(join(modulePath, 'infrastructure/repositories/memory.ts'), '{{nameCamel}}', nameCamel)

              await Files.deleteFile(join(modulePath, 'infrastructure/repositories/grpc.ts'))
              await Files.deleteFile(join(modulePath, 'infrastructure/repositories/drizzle.ts'))
              break;
            case RepositoryType.GRPC_CLIENT:
              await Files.replaceInFile(join(modulePath, 'infrastructure/repositories/grpc.ts'), '{{name}}', nameEntity)
              await Files.replaceInFile(join(modulePath, 'infrastructure/repositories/grpc.ts'), '{{nameClean}}', nameClean)
              await Files.replaceInFile(join(modulePath, 'infrastructure/repositories/grpc.ts'), '{{nameCamel}}', nameCamel)

              await Files.deleteFile(join(modulePath, 'infrastructure/repositories/drizzle.ts'))
              await Files.deleteFile(join(modulePath, 'infrastructure/repositories/memory.ts'))
              break;
            default:
              await Files.deleteFile(join(modulePath, 'infrastructure/repositories/memory.ts'))
              await Files.deleteFile(join(modulePath, 'infrastructure/repositories/drizzle.ts'))
              await Files.deleteFile(join(modulePath, 'infrastructure/repositories/grpc.ts'))
              break;
          }
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
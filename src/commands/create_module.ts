import { Command } from 'commander'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { join } from 'path'

import { MODULE_ROUTES, ModuleType, RepositoryType, RouterType, TEMPLATES } from 'src/config/constants'

import { Files } from 'src/utils/files'
import { Strings } from 'src/utils/strings'

/**
 * User answers
 */
interface Answers {
  /**
   * Module name
   */
  name: string

  /**
   * Module type
   */
  moduleType: ModuleType

  /**
   * Router type, this is only asked when the module is of type FULL
   */
  routerType: RouterType

  /**
   * Repository type, this is only asked when the module is of type FULL
   */
  repositoryType: RepositoryType
}

export class CreateModule {
  /**
   * Module path
   */
  private static modulePath: string

  /**
   * Name of the entity
   */
  private static nameEntity: string

  /**
   * Name of the entity clean
   */
  private static nameClean: string

  /**
   * Name of the entity in camel case
   */
  private static nameCamel: string

  /**
   * Name of the entity in kebab case
   */
  private static nameKebab: string

  /**
   * Repository name
   */
  private static repositoryName: string

  /**
   * Repository name clean
   */
  private static repositoryClean: string

  /**
   * Create a module command
   * 
   * @returns The command
   */
  public static command(): Command {
    return new Command('create:module')
      .argument('[name]', 'Module name')
      .description('Create a new module')
      .action(async (name: string | undefined) => {
        try {
          if (!name) {
            const nameAnswer = await inquirer.prompt<Answers>([
              { type: 'input', name: 'name', message: 'What is the name of the module?' }
            ])
            name = nameAnswer.name
          }

          const { moduleType } = await inquirer.prompt<Answers>([
            {
              type: 'list',
              name: 'moduleType',
              message: 'What type of module do you want to create?',
              choices: [
                { name: 'Full module (domain, application, and infrastructure)', value: ModuleType.FULL },
                { name: 'Domain module (only domain)', value: ModuleType.ONLY_DOMAIN }
              ]
            }
          ])

          if (!await Files.directoryExists('src/modules')) {
            console.error(chalk.red(`Error: directory "src/modules" does not exist.`))
            return
          }

          CreateModule.setNameVariations(name)

          if (await Files.directoryExists(CreateModule.modulePath)) {
            console.error(chalk.red(`Error: module "${CreateModule.nameEntity}" already exists.`))
            return
          }

          console.log(chalk.green(`Creating module "${CreateModule.nameEntity}"...`))
          await Files.copyDirectory(join(TEMPLATES, MODULE_ROUTES[moduleType]), CreateModule.modulePath)

          await CreateModule.modifyDomainFiles()
          if (moduleType === ModuleType.FULL) {
            await CreateModule.modifyApplicationFiles()
            await CreateModule.modifyInfrastructureFiles()
          }

          console.log(chalk.blue('Module created successfully!'))
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error(chalk.red(`Error: ${error.message}`))
            return
          }
          console.error(chalk.red('An unexpected error occurred.'))
        }
      })
  }

  /**
   * Modify domain files
   */
  private static async modifyDomainFiles() {
    await CreateModule.modifyFiles([
      join(CreateModule.modulePath, 'domain/entity.ts'),
      join(CreateModule.modulePath, 'domain/repository.ts'),
      join(CreateModule.modulePath, 'domain/value.ts')
    ])
  }

  /**
   * Modify application files
   */
  private static async modifyApplicationFiles() {
    await CreateModule.modifyFiles([
      join(CreateModule.modulePath, 'application/dtos/create.ts'),
      join(CreateModule.modulePath, 'application/dtos/response.ts'),
      join(CreateModule.modulePath, 'application/schemas/schema.ts'),
      join(CreateModule.modulePath, 'application/use_cases/use_cases.ts')
    ])
  }

  /**
   * Modify infrastructure files
   */
  private static async modifyInfrastructureFiles() {
    const { routerType, repositoryType } = await inquirer.prompt<Answers>([
      {
        type: 'list',
        name: 'routerType',
        message: 'What type of router do you want to create?',
        choices: Object.values(RouterType).map(value => ({ name: Strings.snakeToNormal(value), value }))
      },
      {
        type: 'list',
        name: 'repositoryType',
        message: 'What type of repository do you want to create?',
        choices: Object.values(RepositoryType).map(value => ({ name: Strings.snakeToNormal(value), value }))
      }
    ])

    CreateModule.repositoryName = Strings.pascalCase(repositoryType)
    CreateModule.repositoryClean = Strings.clean(repositoryType)

    if (routerType === RouterType.GRPC) {
      // TODO: Implement grpc if needed
    }

    if (repositoryType === RepositoryType.GRPC_CLIENT) {
      // TODO: Implement grpc client if needed
    }

    const infraFiles: Record<string, string[]> = {
      [RepositoryType.DRIZZLE]: ['infrastructure/repositories/drizzle.ts'],
      [RepositoryType.IN_MEMORY]: ['infrastructure/repositories/memory.ts'],
      [RepositoryType.GRPC_CLIENT]: ['infrastructure/repositories/grpc_client.ts'],
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

  /**
   * Modify files
   * 
   * @param files - Files to modify
   */
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

  /**
   * Replace placeholders in file
   * 
   * @param filePath - File path
   */
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

  /**
   * Set name variations
   * 
   * @param name - Module name
   */
  private static setNameVariations(name: string) {
    const clean = Strings.clean(name)
    CreateModule.nameClean = clean
    CreateModule.nameCamel = Strings.camelCase(clean)
    CreateModule.nameKebab = Strings.kebabCase(CreateModule.nameCamel)
    CreateModule.nameEntity = Strings.pascalCase(clean)
    CreateModule.modulePath = join('src/modules', clean)
  }

  /**
   * Delete unnecessary files
   * 
   * @param repositoryType - Repository type
   * @param routerType - Router type
   */
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
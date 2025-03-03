import { Command } from 'commander'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { join } from 'path'

import { MODULE_ROUTES, ModuleType, TEMPLATES } from 'src/config/constants.js'

import { Files } from 'src/utils/files.js'
import { Strings } from 'src/utils/strings.js'

interface ModuleAnswer {
  name: string
}

interface ModuleTypeAnswers {
  moduleType: ModuleType
}

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
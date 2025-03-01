import { Command } from 'commander'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { join } from 'path'

import { MODULE_ROUTES, ModuleType } from 'src/config/constants.js'

import { Files } from 'src/utils/files.js'
import { Strings } from 'src/utils/strings.js'

interface ModuleAnswer {
  name: string
}

interface ModuleTypeAnswers {
  moduleType: ModuleType
}

export function createProject() {
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

        console.log(chalk.green(`Creando módulo "${name}" de tipo ${Strings.fistLetterToUpperCase(moduleType)}...`))
        await Files.copyDirectory(MODULE_ROUTES[moduleType], name)
      } catch (error: unknown) {
        
      }
    })
}
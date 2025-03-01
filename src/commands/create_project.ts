import { Command } from 'commander'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { join } from 'path'

import { Template, TEMPLATES } from 'src/config/constants.js'

import { Files } from 'src/utils/files.js'
import { Strings } from 'src/utils/strings.js'

export function createProject() {
  return new Command('create:project')
    .argument('[name]', 'Nombre del proyecto')
    .description('Crea un nuevo proyecto')
    .action(async (name: string | undefined) => {
      try {
        if (!name) {
          const nameAnswer = await inquirer.prompt([
            { type: 'input', name: 'name', message: '¿Qué nombre tendrá el proyecto?' },
          ])
          name = nameAnswer.name
        }

        const templateAnswers = await inquirer.prompt([
          {
            type: 'list',
            name: 'template',
            message: '¿Qué plantilla deseas utilizar?',
            choices: [
              { name: 'Rest API sin autenticación', value: Template.REST },
              { name: 'Rest API con autenticación mediante JWT', value: Template.AUTH },
              { name: 'GRPC Server', value: Template.GRPC }
            ]
          }
        ])
        const template = templateAnswers.template

        const projectName = name || 'project'

        console.log(chalk.green(`Creando proyecto "${name}" con plantilla ${template}...`))
        await Files.copyDirectory(join(TEMPLATES, template), projectName)

        await Files.replaceInFile(join(projectName, 'package.json'), '{{name}}', Strings.clean(projectName))
        await Files.replaceInFile(join(projectName, '.env.example'), '{{name}}', Strings.clean(projectName))
        await Files.replaceInFile(join(projectName, '.env.test'), '{{name}}', Strings.clean(projectName))
        await Files.replaceInFile(join(projectName, 'README.md'), '{{name}}', Strings.fistLetterToUpperCase(projectName))
        await Files.replaceInFile(join(projectName, '.dockers/compose.yml'), '{{name}}', Strings.clean(projectName))

        console.log(chalk.blue('Proyecto creado exitosamente'))
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(chalk.red(`Error: ${error.message}`))
        } else {
          console.error(chalk.red('Ha ocurrido un error inesperado.'))
        }
      }
    })
}
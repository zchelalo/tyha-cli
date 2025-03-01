import { Command } from 'commander'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { join } from 'path'

import { Template, TEMPLATE_ROUTES, TEMPLATES } from 'src/config/constants.js'

import { Files } from 'src/utils/files.js'
import { Strings } from 'src/utils/strings.js'

interface NameAnswer {
  name: string
}

interface TemplateAnswers {
  template: Template
}

export function createProject() {
  return new Command('create:project')
    .argument('[name]', 'Nombre del proyecto')
    .description('Crea un nuevo proyecto')
    .action(async (name: string | undefined) => {
      try {
        if (!name) {
          const nameAnswer = await inquirer.prompt<NameAnswer>([
            { type: 'input', name: 'name', message: '¿Qué nombre tendrá el proyecto?' },
          ])
          name = nameAnswer.name
        }

        const templateAnswers = await inquirer.prompt<TemplateAnswers>([
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

        const projectPath = Strings.clean(name)

        console.log(chalk.green(`Creando proyecto "${Strings.fistLetterToUpperCase(name)}" con plantilla ${Strings.fistLetterToUpperCase(template)}...`))
        await Files.copyDirectory(join(TEMPLATES, TEMPLATE_ROUTES[template]), projectPath)

        await Files.replaceInFile(join(projectPath, 'package.json'), '{{name}}', projectPath)
        await Files.replaceInFile(join(projectPath, '.env.example'), '{{name}}', projectPath)
        await Files.replaceInFile(join(projectPath, '.env.test'), '{{name}}', projectPath)
        await Files.replaceInFile(join(projectPath, 'README.md'), '{{name}}', Strings.fistLetterToUpperCase(name))
        await Files.replaceInFile(join(projectPath, '.dockers/compose.yml'), '{{name}}', projectPath)

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
import { Command } from 'commander'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { join } from 'path'

import { Template, TEMPLATES } from 'src/config/constants.js'

import { Files } from 'src/utils/files.js'

export function createProject() {
  return new Command('create:project')
    .argument('[name]', 'Nombre del proyecto')
    .option('-a, --auth', 'Crear un proyecto con autenticación', false)
    .option('-g, --grpc', 'Crear un proyecto con gRPC', false)
    .description('Crea un nuevo proyecto')
    .action(async (name: string | undefined, options: { auth?: boolean, grpc?: boolean }) => {
      try {
        if (!name) {
          const answers = await inquirer.prompt([
            { type: 'input', name: 'name', message: '¿Nombre del proyecto?' },
          ])
          name = answers.name
        }

        let template = Template.REST
        if (options.auth) template = Template.AUTH
        else if (options.grpc) template = Template.GRPC

        const projectName = name || 'project'

        console.log(chalk.green(`Creando proyecto "${name}" con plantilla ${template}...`))
        await Files.copyDirectory(join(TEMPLATES, template), projectName)

        await Files.replaceInFile(join(projectName, 'package.json'), '{{name}}', projectName)

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
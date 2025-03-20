import { Command } from 'commander'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { join } from 'path'

import { Template, TEMPLATE_ROUTES, TEMPLATES } from 'src/config/constants'

import { Files } from 'src/utils/files'
import { Strings } from 'src/utils/strings'

interface Answers {
  name: string
  projectType: Template.REST | Template.GRPC
}

export class CreateProject {
  public static command(): Command {
    return new Command('create:project')
    .argument('[name]', 'Name of the project')
    .description('Create a new project')
    .action(async (name: string | undefined) => {
      try {
        if (!name) {
          const nameAnswer = await inquirer.prompt<Answers>([
            { type: 'input', name: 'name', message: 'What is the name of the project?' }
          ])
          name = nameAnswer.name
        }

        const { projectType } = await inquirer.prompt<Answers>([
          {
            type: 'list',
            name: 'projectType',
            message: 'What type of project do you want to create?',
            choices: [
              { name: 'REST Server', value: Template.REST },
              { name: 'gRPC Server', value: Template.GRPC }
            ]
          }
        ])
        let template: Template = projectType

        if (template === Template.REST) {
          const { auth } = await inquirer.prompt([
            { type: 'confirm', name: 'auth', message: 'Do you want to add authentication?' }
          ])
          if (auth) template = Template.AUTH
        }

        const projectPath = Strings.clean(name)

        console.log(chalk.green(`Creating project ${name}...`))
        await Files.copyDirectory(join(TEMPLATES, TEMPLATE_ROUTES[template]), projectPath)

        await Files.replaceInFile(join(projectPath, 'package.json'), '{{name}}', projectPath)
        await Files.replaceInFile(join(projectPath, '.env.example'), '{{name}}', projectPath)
        await Files.replaceInFile(join(projectPath, '.env.test'), '{{name}}', projectPath)
        await Files.replaceInFile(join(projectPath, 'README.md'), '{{name}}', Strings.firstLetterToUpperCase(name))
        await Files.replaceInFile(join(projectPath, '.dockers/compose.yml'), '{{name}}', projectPath)

        console.log(chalk.blue('Project created successfully!'))
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(chalk.red(`Error: ${error.message}`))
          return
        }
        console.error(chalk.red('An error occurred while creating the project'))
      }
    })
  }
}
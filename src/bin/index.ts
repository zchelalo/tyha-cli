#!/usr/bin/env node
import { Command } from 'commander'

import { CreateProject } from 'src/commands/create_project.js'
import { CreateModule } from 'src/commands/create_module.js'

const program = new Command()

program
  .name('tyha')
  .version('1.0.0')
  .description('CLI for manage projects in TypeScript with Hexagonal Architecture')

/**
 * Comandos de la aplicación
 */
program.addCommand(CreateProject.command())
program.addCommand(CreateModule.command())

program.parse(process.argv)
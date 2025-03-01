#!/usr/bin/env node
import { Command } from 'commander'

import { createProject } from 'src/commands/create_project.js'
import { createModule } from 'src/commands/create_module.js'

const program = new Command()

program
  .name('tyha')
  .version('1.0.0')
  .description('CLI para manejar proyectos con typescript y hexagonal architecture')

/**
 * Comandos de la aplicación
 */
program.addCommand(createProject())
program.addCommand(createModule())

program.parse(process.argv)
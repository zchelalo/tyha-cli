import { Command } from 'commander'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { join } from 'path'

import { Files } from 'src/utils/files.js'

export function createProject() {
  return new Command('create:module')
    .argument('[name]', 'Nombre del módulo')
    .option('-f, --full', 'Crear un módulo con todas las capas', false)
    .option('-d, --domain', 'Crear un módulo con solo la capa de dominio', false)
    .description('Crea un nuevo proyecto')
    .action(async (name: string | undefined, options: { auth?: boolean, grpc?: boolean }) => {
      try {
        
      } catch (error: unknown) {
        
      }
    })
}
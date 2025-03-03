import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

export const TEMPLATES = join(dirname(fileURLToPath(import.meta.url)), '../../templates')

export enum Template {
  REST = 'rest',
  AUTH = 'auth',
  GRPC = 'grpc',
}

export const TEMPLATE_ROUTES: Record<Template, string> = {
  [Template.REST]: 'projects/rest',
  [Template.AUTH]: 'projects/auth',
  [Template.GRPC]: 'projects/grpc',
}

export enum ModuleType {
  FULL = 'full',
  ONLY_DOMAIN = 'only_domain',
}

export const MODULE_ROUTES: Record<ModuleType, string> = {
  [ModuleType.FULL]: 'modules/full',
  [ModuleType.ONLY_DOMAIN]: 'modules/only_domain',
}

export enum RouterType {
  REST = 'rest',
  GRPC = 'grpc',
}

export enum RepositoryType {
  IN_MEMORY = 'in_memory',
  DRIZZLE = 'drizzle',
  GRPC_CLIENT = 'grpc_client',
}
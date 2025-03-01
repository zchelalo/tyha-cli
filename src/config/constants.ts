import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

export const TEMPLATES = join(dirname(fileURLToPath(import.meta.url)), '../../templates')

export enum Template {
  REST = 'rest',
  AUTH = 'auth',
  GRPC = 'grpc',
  WEB_SOCKET = 'web_socket',
}
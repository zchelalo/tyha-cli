import { createLogger, format, transports } from 'winston'

/**
 * Logger configuration with Winston.
*/
export const logger = createLogger({
  level: 'info', // Nivel de logging
  format: format.combine(
    format.timestamp(), // Añade timestamp a los logs
    format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`
    })
  ),
  transports: [
    new transports.Console(),  // Muestra los logs en la consola
    new transports.File({ filename: 'logs/app.log' })  // Guarda los logs en un archivo
  ]
})
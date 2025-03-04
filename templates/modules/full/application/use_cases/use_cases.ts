import { {{name}}Repository } from 'src/modules/{{nameClean}}/domain/repository.js'
import { {{name}}Value } from 'src/modules/{{nameClean}}/domain/value.js'
import { DTO{{name}}Create } from 'src/modules/{{nameClean}}/application/dtos/{{nameClean}}_create.js'
import { DTO{{name}}Response } from 'src/modules/{{nameClean}}/application/dtos/{{nameClean}}_response.js'
import {
  get{{name}}ByIdSchema,
  paginationSchema
} from 'src/modules/{{nameClean}}/application/schemas/{{nameClean}}.js'

/**
 * Create a new {{name}} Use Case.
 * Provides methods to interact with {{nameCamel}} data including retrieving, creating, and counting {{nameCamel}} objects.
 * 
 * This class is part of the application layer in the hexagonal architecture and relies on a {{name}}Repository to access and manipulate {{nameCamel}} data.
 * 
 * @link {{nameClean}}Repository - The repository used to interact with {{nameCamel}} data.
 * @link {{name}}Value - The value object used to create a new {{nameCamel}}.
 * @link DTO{{name}}Create - The data transfer object used to create a new {{nameCamel}}.
 * @link DTO{{name}}Response - The data transfer object used to return a {{nameCamel}}.
 * 
 * @example
 * ```ts
 * const postgresRepository = new PostgresRepository()
 * const {{nameCamel}}UseCase = new {{name}}UseCase(postgresRepository)
 * ```
 */
export class {{name}}UseCase {
  /**
   * @private
   * @property {{{name}}Repository} {{nameCamel}}Repository - The repository used to interact with {{nameCamel}} data.
   * This repository is injected via the constructor to decouple the data access layer from the application logic.
  */
  private readonly {{nameCamel}}Repository: {{name}}Repository

  /**
   * Creates an instance of {{name}}UseCase.
   * 
   * @param {{{name}}Repository} {{nameCamel}}Repository - The repository that provides access to {{nameCamel}} data.
   * The repository is injected to allow for greater flexibility and easier testing.
  */
  constructor({{nameCamel}}Repository: {{name}}Repository) {
    this.{{nameCamel}}Repository = {{nameCamel}}Repository
  }

  /**
   * @function get{{name}}ById
   * @description Get a {{nameCamel}} by id.
   * @param id - Id of {{nameCamel}}.
   * @returns {Promise<DTO{{name}}Response>} A promise that resolves to the DTO{{name}}Response.
   * @example
   * ```ts
   * const id = '938d6f5b-b4a6-4669-a514-ddb3a23621fc'
   * const {{nameCamel}} = await {{nameCamel}}UseCase.get{{name}}ById(id)
   * ```
  */
  public async get{{name}}ById(id: string): Promise<DTO{{name}}Response> {
    get{{name}}ByIdSchema.parse({ id })

    const {{nameCamel}}Obtained = await this.{{nameCamel}}Repository.get{{name}}ById(id)
    return new DTO{{name}}Response({{nameCamel}}Obtained)
  }

  /**
   * @function list
   * @description Get a page of {{nameCamel}} objects.
   * @param page - The page of the meta.
   * @param limit - The limit of the meta.
   * @returns {Promise<DTO{{name}}Response[]>} A promise that resolves to an array of DTO{{name}}Response.
   * @example
   * ```ts
   * const page = 1
   * const limit = 10
   * const {{nameCamel}} = await {{nameCamel}}UseCase.list(page, limit)
   * ```
  */
  public async list(page: number, limit: number): Promise<DTO{{name}}Response[]> {
    paginationSchema.parse({ page, limit })

    const count{{name}} = await this.{{nameCamel}}Repository.count()
    const meta = new Meta({
      page: page,
      perPage: limit,
      total: count{{name}},
      pagLimitDef: process.env.PAGINATION_LIMIT_DEFAULT
    })
    const {{nameCamel}}Obtained = await this.{{nameCamel}}Repository.list(meta.getOffset(), meta.getLimit())
    return {{nameCamel}}Obtained.map({{nameCamel}} => new DTO{{name}}Response({{nameCamel}}))
  }

  /**
   * @function count
   * @description Get the count of {{nameCamel}} objects.
   * @returns {Promise<number>} A promise that resolves to a number of {{nameCamel}} objects.
   * @example
   * ```ts
   * const count = await {{nameCamel}}UseCase.count()
   * ```
  */
  public async count(): Promise<number> {
    return this.{{nameCamel}}Repository.count()
  }

  /**
   * @function create{{name}}
   * @description Create a new {{nameCamel}}.
   * @param {{nameCamel}} - {{name}} to be created.
   * @returns {Promise<DTO{{name}}Response>} A promise that resolves to the {{nameCamel}}'s DTO{{name}}Response created.
   * @example
   * ```ts
   * const {{nameCamel}} = {
   * }
   * const new{{name}} = await {{nameCamel}}UseCase.create{{name}}({{nameCamel}})
   * ```
  */
  public async create{{name}}({{nameCamel}}: DTO{{name}}Create): Promise<DTO{{name}}Response> {
    // create{{name}}Schema.parse({{nameCamel}})

    const {{nameCamel}}Value = new {{name}}Value()
    await this.{{nameCamel}}Repository.create{{name}}({{nameCamel}}Value)
    return new DTO{{name}}Response({{nameCamel}}Value)
  }
}
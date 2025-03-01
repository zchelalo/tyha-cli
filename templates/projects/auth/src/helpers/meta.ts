/**
 * NewMeta type. 
 * 
 * @property {number} page - The current page number.
 * @property {number} perPage - The number of items per page.
 * @property {number} total - The total number of items.
 * @property {number} pagLimitDef - The default number of items per page.
*/
type NewMeta = {
  page: number
  perPage: number
  total: number
  pagLimitDef: number
}

/**
 * The Meta class. This class is used to create a meta object that contains pagination information.
 * 
 * @property {number} page - The current page number.
 * @property {number} perPage - The number of items per page.
 * @property {number} pageCount - The total number of pages.
 * @property {number} totalCount - The total number of items.
 * @example
 * ```ts
 * const meta = new Meta({ page: 1, perPage: 10, total: 100, pagLimitDef: 10 })
 * ```
*/
export class Meta {
  /**
   * @property {number} page - The current page number.
  */
  public page: number

  /**
   * @property {number} perPage - The number of items per page.
  */
  public perPage: number

  /**
   * @property {number} pageCount - The total number of pages.
  */
  public pageCount: number

  /**
   * @property {number} totalCount - The total number of items.
  */
  public totalCount: number

  /**
   * The constructor of the Meta class.
   * 
   * @param {NewMeta} newMeta - The new meta object.
  */
  constructor({ page, perPage, total, pagLimitDef }: NewMeta) {
    this.page = page
    this.totalCount = total
  
    this.perPage = perPage > 0 ? perPage : pagLimitDef
  
    this.pageCount = total >= 0 ? Math.ceil(total / this.perPage) : 0
  
    if (this.page < 1) {
      this.page = 1
    } else if (this.page > this.pageCount) {
      this.page = this.pageCount
    }
  }

  /**
   * The getOffset method. This method returns the offset value for the current page.
   * 
   * @returns {number} The offset value.
  */
  public getOffset(): number {
    return (this.page - 1) * this.perPage
  }

  /**
   * The getLimit method. This method returns the limit value for the current page.
   * 
   * @returns {number} The limit value.
  */
  public getLimit(): number {
    return this.perPage
  }
}
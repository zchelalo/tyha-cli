import { BadRequestError, UnauthorizedError, DatabaseError } from 'src/helpers/errors/custom_error'

describe('Validate custom errors', () => {
  it('should throw a BadRequestError', () => {
    expect(() => {
      throw new BadRequestError('invalid request')
    }).toThrow(BadRequestError)
  })

  it('should throw a UnauthorizedError', () => {
    expect(() => {
      throw new UnauthorizedError()
    }).toThrow(UnauthorizedError)
  })

  it('should throw a DatabaseError', () => {
    expect(() => {
      throw new DatabaseError('error in database')
    }).toThrow(DatabaseError)
  })
})

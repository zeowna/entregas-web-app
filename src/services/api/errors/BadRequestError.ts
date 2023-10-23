import { ValidationError, ValidationErrorRaw } from './ValidationError'

export class BadRequestError extends Error {
  readonly name = 'BAD_REQUEST_ERROR'
  errors: ValidationError[] = []

  constructor(validationErrors: ValidationErrorRaw | ValidationErrorRaw[]) {
    const errList = Array.isArray(validationErrors) ? validationErrors : [validationErrors]

    console.log(errList)

    const errors = errList.map((err) => new ValidationError(err.property, err.constraints))

    super(errors.map(({ message }) => message).join(', ') + '.')
    this.errors = errors
  }
}

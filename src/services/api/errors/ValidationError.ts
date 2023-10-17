export interface ValidationErrorRaw {
  property: string;
  constraints: Record<string, string>
  children: ValidationErrorRaw[]
}

export class ValidationError extends Error {
  readonly name = 'VALIDATION_ERROR'
  readonly property: string;
  readonly constraints: Record<string, string>

  constructor(
    property: string,
    constraints: Record<string, string>,
  ) {
    super(Object.values(constraints).join(', ') + '');

    this.constraints = constraints
    this.property = property
  }
}

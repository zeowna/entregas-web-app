export class NotFoundError extends Error {
  name = 'NOT_FOUND'

  constructor(message: string) {
    super(message);
  }

}

export class ServerError extends Error {
  constructor (stack?: string, message?: string) {
    super(`Internal server error: ${message ?? 'An unexpected error occurred'}`);
    this.name = 'ServerError';
    this.stack = stack;
  }
}

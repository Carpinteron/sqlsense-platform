export class ExpectedQueryParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExpectedQueryParseError';
  }
}

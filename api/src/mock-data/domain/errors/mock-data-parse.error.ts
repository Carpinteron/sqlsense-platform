export class MockDataParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MockDataParseError';
  }
}

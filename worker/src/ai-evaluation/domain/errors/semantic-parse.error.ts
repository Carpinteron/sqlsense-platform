export class SemanticParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SemanticParseError';
  }
}

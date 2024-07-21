export class CustomError extends Error {
  constructor(
    public message: string,
    public type: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

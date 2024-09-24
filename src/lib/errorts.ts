export abstract class ErrorAbstract {
  constructor(
    readonly errorMessage: string,
    readonly status: number,
  ) {}
}

/**
 * Shared error classes
 */

/** API Error from NotePM */
export class NotePMAPIError extends Error {
  constructor(
    public statusCode: number,
    public statusText: string,
    message: string
  ) {
    super(message);
    this.name = "NotePMAPIError";
  }
}

/** Input validation error */
export class InputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InputError";
  }
}

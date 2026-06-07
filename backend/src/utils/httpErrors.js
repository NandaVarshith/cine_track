export class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export function notFound(message) {
  return new AppError(message, 404);
}

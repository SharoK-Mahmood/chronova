export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function notFound(entity = "Resource"): HttpError {
  return new HttpError(404, `${entity} not found`, "NOT_FOUND");
}

export function unauthorized(message = "Authentication required"): HttpError {
  return new HttpError(401, message, "UNAUTHORIZED");
}

export function forbidden(message = "You do not have permission to do that"): HttpError {
  return new HttpError(403, message, "FORBIDDEN");
}

export function badRequest(message: string, code = "BAD_REQUEST"): HttpError {
  return new HttpError(400, message, code);
}

export function conflict(message: string, code = "CONFLICT"): HttpError {
  return new HttpError(409, message, code);
}

import { Request, Response, NextFunction } from "express";

// Map simple error indicators to HTTP status codes.
function mapErrorToStatus(err: Error): number {
  const msg = err.message.toLowerCase();

  // common patterns
  if (msg.includes("not found") || msg.includes("no such")) return 404;
  if (
    msg.includes("unauthorized") ||
    msg.includes("invalid token") ||
    msg.includes("authentication")
  )
    return 401;
  if (msg.includes("forbidden") || msg.includes("permission")) return 403;
  if (
    msg.includes("validation") ||
    msg.includes("invalid") ||
    msg.includes("missing")
  )
    return 400;
  if (msg.includes("conflict") || msg.includes("already exists")) return 409;
  if (msg.includes("unprocessable") || msg.includes("unprocessable entity"))
    return 422;

  // fallback to 500
  return 500;
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!err) return next();

  const status = mapErrorToStatus(err);

  const payload: any = { error: err.message };

  // Include stack in non-production for easier debugging
  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
}

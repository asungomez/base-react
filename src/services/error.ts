const ERROR_CODES = [
  "INCORRECT_PASSWORD",
  "INTERNAL_ERROR",
  "USER_NOT_EXISTS",
  "DUPLICATED_USER",
  "INVALID_PASSWORD",
] as const;

export type ErrorCode = typeof ERROR_CODES[number];

export const isErrorCode = (value: unknown): value is ErrorCode =>
  typeof value === "string" && ERROR_CODES.includes(value as ErrorCode);
const ERROR_CODES = [
  "INCORRECT_PASSWORD",
  "INTERNAL_ERROR",
  "USER_NOT_EXISTS",
  "DUPLICATED_USER",
  "INVALID_PASSWORD",
  "INVALID_RESET_PASSWORD_LINK",
  "TOO_MANY_RETRIES",
  "UNAUTHORIZED",
  "CUSTOMER_NOT_FOUND",
  "DUPLICATED_CUSTOMER",
  "REQUIRED_EMAIL",
  "REQUIRED_TAX_ID",
  "REQUIRED_COMPANY_NAME",
  "REQUIRED_COMPANY_ADDRESS",
  "REQUIRED_STREET",
  "REQUIRED_CITY",
  "REQUIRED_NUMBER",
  "REQUIRED_POSTCODE",
] as const;

export type ErrorCode = typeof ERROR_CODES[number];

export const isErrorCode = (value: unknown): value is ErrorCode =>
  typeof value === "string" && ERROR_CODES.includes(value as ErrorCode);

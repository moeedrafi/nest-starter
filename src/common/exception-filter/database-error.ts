import { QueryFailedError } from 'typeorm';

interface PostgresDriverError {
  code?: string;
  column?: string;
  detail?: string;
  constraint?: string;
}

interface DatabaseErrorResult {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
}

export function mapDatabaseError(error: unknown): DatabaseErrorResult | null {
  if (!(error instanceof QueryFailedError)) {
    return null;
  }

  const driverError = error.driverError as PostgresDriverError | undefined;

  switch (driverError?.code) {
    /**
     * PostgreSQL:
     * unique_violation
     */
    case '23505':
      return {
        statusCode: 409,
        code: 'CONFLICT',
        message: 'Resource already exists',
      };

    /**
     * PostgreSQL:
     * foreign_key_violation
     */
    case '23503':
      return {
        statusCode: 400,
        code: 'INVALID_REFERENCE',
        message: 'Invalid reference',
      };

    /**
     * PostgreSQL:
     * not_null_violation
     */
    case '23502':
      return {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message: 'Required field is missing',
        details: {
          field: driverError.column,
        },
      };

    /**
     * PostgreSQL:
     * invalid_text_representation
     *
     * Example:
     * invalid UUID
     */
    case '22P02':
      return {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
      };

    /**
     * PostgreSQL:
     * numeric_value_out_of_range
     */
    case '22003':
      return {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message: 'Value is out of range',
      };

    /**
     * PostgreSQL:
     * check_violation
     */
    case '23514':
      return {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message: 'Invalid value',
      };

    default:
      return null;
  }
}

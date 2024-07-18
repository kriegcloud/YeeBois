import { entityKind } from "@/lib/funk/entity";

export class DankError extends Error {
  static readonly [entityKind]: string = 'DrizzleError';

  constructor({ message, cause }: { message?: string; cause?: unknown }) {
    super(message);
    this.name = 'DankError';
    this.cause = cause;
  }
}

/**
 * Types of errors for Rules Engine Package
 * - RuleError: Error in the rule
 * - RuleExecutionError: Error in the rule execution
 * - RuleValidationError: Error in the rule validation
 */

export class RuleError extends DankError {
  static readonly [entityKind]: string = 'TransactionRollbackError';

  constructor() {
    super({ message: 'RuleError' });
  }
}

export class RuleExecutionError extends DankError {
  static readonly [entityKind]: string = 'RuleExecutionError';

  constructor({ message }: { message: string }) {
    super({ message });
  }
}

export class RuleValidationError extends DankError {
  static readonly [entityKind]: string = 'RuleValidationError';

  constructor({ message }: { message: string }) {
    super({ message });
  }
}
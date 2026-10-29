import type { FieldDefinition, Rule, ValidationErrors } from '../types/form';

/**
 * A value is considered empty when it is absent, an empty string, an empty
 * array, or `false` for a single checkbox.
 */
export function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'boolean') return value === false;
  return false;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_PATTERN = /^(https?:\/\/)[^\s.]+\.[^\s]{2,}$/i;

/** Coerce a value to a finite number, or `null` when it is not numeric. */
function toNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function passes(rule: Rule, value: unknown): boolean {
  switch (rule.type) {
    case 'required':
      return !isEmpty(value);
    case 'minLength':
      return typeof value === 'string' && value.trim().length >= rule.value;
    case 'maxLength':
      return typeof value === 'string' && value.trim().length <= rule.value;
    case 'email':
      return typeof value === 'string' && EMAIL_PATTERN.test(value.trim());
    case 'url':
      return typeof value === 'string' && URL_PATTERN.test(value.trim());
    case 'min': {
      const numeric = toNumber(value);
      return numeric !== null && numeric >= rule.value;
    }
    case 'max': {
      const numeric = toNumber(value);
      return numeric !== null && numeric <= rule.value;
    }
    case 'minSelected':
      return Array.isArray(value) && value.length >= rule.value;
    default:
      return true;
  }
}

/**
 * Rules that describe the *presence* of an answer rather than the content of
 * one. These still apply to an empty value — a checkbox group with nothing
 * selected has failed its minimum selection, not been left blank.
 */
const PRESENCE_RULES: ReadonlySet<Rule['type']> = new Set(['required', 'minSelected']);

/**
 * Validate a single value against a list of rules.
 *
 * Pure function: returns every failing rule's message, in rule order.
 */
export function validateField(value: unknown, rules: Rule[]): string[] {
  const errors: string[] = [];

  for (const rule of rules) {
    // Optional fields that are empty only fail the presence rules.
    const empty = isEmpty(value);
    if (empty && !PRESENCE_RULES.has(rule.type)) continue;

    if (!passes(rule, value)) {
      errors.push(rule.message);
    }
  }

  return errors;
}

/**
 * Validate every field in a step.
 *
 * Returns errors keyed by field name. Fields without errors are omitted.
 */
export function validateStep(
  fields: FieldDefinition[],
  values: Record<string, unknown>,
): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const field of fields) {
    const messages = validateField(values[field.name], field.rules);
    if (messages.length > 0) {
      errors[field.name] = messages;
    }
  }

  return errors;
}

/**
 * Validate every step of the form and return the errors keyed by step id.
 */
export function validateAllSteps(
  steps: { id: string; fields: FieldDefinition[] }[],
  values: Record<string, unknown>,
): Record<string, ValidationErrors> {
  const result: Record<string, ValidationErrors> = {};

  for (const step of steps) {
    const errors = validateStep(step.fields, values);
    if (Object.keys(errors).length > 0) {
      result[step.id] = errors;
    }
  }

  return result;
}

/** True when the value is empty for the purposes of the review summary. */
export function isBlank(value: unknown): boolean {
  return isEmpty(value);
}

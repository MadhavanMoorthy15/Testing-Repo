import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import styles from './FieldShell.module.css';

interface FieldShellProps {
  /** Stable id used to wire label, control, hint, and error together. */
  fieldId: string;
  label: ReactNode;
  hint?: string;
  errors?: string[];
  /** Whether the field is required. Renders the brass dot. */
  required?: boolean;
  /** A small character counter, when relevant. */
  counter?: { current: number; max: number };
  /**
   * The control. It is cloned so the accessibility attributes
   * (`aria-invalid`, `aria-describedby`, `aria-errormessage`) land on the
   * focusable element itself rather than on a wrapper.
   */
  children: ReactElement;
}

/**
 * The labelled, hinted, errored wrapper that surrounds every control.
 *
 * Owns the id wiring (`htmlFor`, `aria-describedby`, `aria-errormessage`)
 * so individual field components do not have to repeat it.
 */
export function FieldShell({
  fieldId,
  label,
  hint,
  errors,
  required,
  counter,
  children,
}: FieldShellProps) {
  const isInvalid = Boolean(errors && errors.length > 0);
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = isInvalid ? `${fieldId}-error` : undefined;
  const firstError = errors?.[0];

  const describedBy = [hintId, errorId].filter(Boolean).join(' ');

  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        id: fieldId,
        'aria-invalid': isInvalid || undefined,
        'aria-describedby': describedBy || undefined,
        'aria-errormessage': errorId,
      })
    : children;

  return (
    <div className={styles.shell}>
      <label htmlFor={fieldId} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            ·
          </span>
        )}
      </label>

      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}

      {control}

      {counter && (
        <p className={styles.counter} aria-live="off">
          {counter.current} / {counter.max}
        </p>
      )}

      {isInvalid && firstError && (
        <p id={errorId} role="alert" className={styles.error}>
          <span className="visually-hidden">Error:</span>
          {firstError}
        </p>
      )}
    </div>
  );
}

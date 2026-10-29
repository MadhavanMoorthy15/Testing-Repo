import styles from './ErrorSummary.module.css';
import type { FieldDefinition, ValidationErrors } from '../types/form';

interface ErrorSummaryProps {
  fields: FieldDefinition[];
  errors: ValidationErrors;
  /** Focuses the control belonging to a field. */
  onFocusField: (fieldName: string) => void;
}

/**
 * The error summary shown when a step cannot be advanced.
 *
 * Each entry is a button that moves focus to the field it refers to, so a
 * keyboard or screen reader user can jump straight to the problem.
 */
export function ErrorSummary({ fields, errors, onFocusField }: ErrorSummaryProps) {
  const entries = fields
    .filter((field) => errors[field.name] && errors[field.name].length > 0)
    .map((field) => ({ field, messages: errors[field.name] }));

  if (entries.length === 0) return null;

  return (
    <div className={styles.summary} role="alert" tabIndex={-1} data-testid="error-summary">
      <p className={styles.title}>
        There {entries.length === 1 ? 'is 1 problem' : `are ${entries.length} problems`} with
        this step
      </p>

      <ul className={styles.list}>
        {entries.map(({ field, messages }) => (
          <li key={field.name}>
            <button
              type="button"
              className={styles.item}
              onClick={() => onFocusField(field.name)}
            >
              <span>
                {field.label}: {messages[0]}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

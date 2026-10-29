import styles from './ReviewSummary.module.css';
import type { FieldDefinition, FormValues, StepDefinition } from '../types/form';

interface ReviewSummaryProps {
  steps: StepDefinition[];
  values: FormValues;
  /** Steps that hold questions, i.e. everything except the review step itself. */
  summarySteps: StepDefinition[];
  onEditStep: (index: number) => void;
}

/**
 * The summary of every answer given.
 *
 * Empty optional answers are shown explicitly as "not provided" rather than
 * being omitted, so the user can see that a field was considered and skipped.
 */
export function ReviewSummary({
  steps,
  values,
  summarySteps,
  onEditStep,
}: ReviewSummaryProps) {
  return (
    <div className={styles.groups}>
      {summarySteps.map((step) => {
        const stepIndex = steps.findIndex((candidate) => candidate.id === step.id);

        return (
          <section key={step.id} className={styles.group}>
            <h3 className={styles.groupLegend}>
              {step.name}
              <span className={styles.groupNumber}>
                {stepIndex + 1} of {steps.length}
              </span>
              <button
                type="button"
                className={styles.edit}
                onClick={() => onEditStep(stepIndex)}
              >
                Edit<span className="visually-hidden"> {step.name}</span>
              </button>
            </h3>

            <p className={styles.groupCaption}>{step.caption}</p>

            <dl className={styles.rows}>
              {step.fields.map((field) => (
                <div key={field.name} className={styles.row}>
                  <dt className={styles.label}>{field.label}</dt>
                  <dd className={styles.value}>
                    <AnswerValue field={field} value={values[field.name]} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        );
      })}
    </div>
  );
}

function AnswerValue({ field, value }: { field: FieldDefinition; value: unknown }) {
  const label = optionLabel(field, value);

  if (label === null) {
    return <span className={styles.empty}>Not provided</span>;
  }

  return <>{label}</>;
}

/**
 * Turn a stored value into display text, or `null` when nothing was given.
 */
function optionLabel(field: FieldDefinition, value: unknown): string | null {
  if (value === undefined || value === null) return null;

  if (field.kind === 'checkbox') {
    return value === true ? 'Yes' : null;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    return value
      .map((entry) => optionLabel(field, entry) ?? String(entry))
      .join(', ');
  }

  const text = String(value).trim();
  if (text === '') return null;

  const option = field.options?.find((candidate) => candidate.value === text);
  return option ? option.label : text;
}

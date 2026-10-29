import styles from './StepActions.module.css';

interface StepActionsProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  /** The label of the primary button. */
  continueLabel?: string;
  /** True while a submission is in flight. */
  busy?: boolean;
  onBack: () => void;
  onContinue: () => void;
}

/** The Back and Continue controls at the foot of the form. */
export function StepActions({
  isFirstStep,
  isLastStep,
  continueLabel,
  busy,
  onBack,
  onContinue,
}: StepActionsProps) {
  const label =
    continueLabel ?? (isLastStep ? 'Send request' : 'Continue');

  return (
    <div className={styles.actions}>
      <button
        type="button"
        className={styles.back}
        onClick={onBack}
        disabled={isFirstStep || busy}
      >
        ← Back
      </button>

      <button
        type="button"
        className={`${styles.continue} ${isLastStep ? styles.continueAccent : ''}`}
        onClick={onContinue}
        disabled={busy}
      >
        {busy ? 'Sending…' : label}
      </button>
    </div>
  );
}

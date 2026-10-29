import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  /** How many steps are complete, out of the total. */
  completed: number;
  total: number;
}

/** A slim bar showing overall completion. */
export function ProgressBar({ completed, total }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      <div
        className={styles.progress}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Form completion"
      >
        <div className={styles.bar} style={{ width: `${percent}%` }} />
      </div>
      <p className={styles.caption} aria-live="polite">
        Step {completed} of {total}
      </p>
    </div>
  );
}

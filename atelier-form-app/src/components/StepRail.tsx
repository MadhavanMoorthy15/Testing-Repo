import styles from './StepRail.module.css';
import type { StepDefinition } from '../types/form';

interface StepRailProps {
  steps: StepDefinition[];
  currentIndex: number;
  /** Index of the furthest step the user has reached. */
  furthestIndex: number;
}

/**
 * The progress rail.
 *
 * On desktop it sits beside the form sheet; on mobile it collapses to a
 * horizontal strip of markers above it.
 */
export function StepRail({ steps, currentIndex, furthestIndex }: StepRailProps) {
  return (
    <nav className={styles.rail} aria-label="Form progress">
      <ol className={styles.list}>
        {steps.map((step, index) => {
          const isCurrent = index === currentIndex;
          const isDone = index < furthestIndex && !isCurrent;

          const state = isCurrent ? 'current' : isDone ? 'done' : 'upcoming';

          return (
            <li
              key={step.id}
              className={[
                styles.item,
                isCurrent ? styles.itemCurrent : '',
                isDone ? styles.itemDone : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span className={styles.marker} aria-hidden="true">
                {isDone ? '✓' : index + 1}
              </span>

              <span className={styles.text}>
                <span className={styles.name}>{step.name}</span>
                <span className={styles.caption}>{step.caption}</span>
                <span className="visually-hidden">
                  {state === 'current'
                    ? ' — current step'
                    : state === 'done'
                      ? ' — completed'
                      : ' — not yet started'}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

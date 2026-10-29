import { useEffect, useRef, useState } from 'react';

import { ErrorSummary } from '../components/ErrorSummary';
import { FieldRenderer } from '../components/fields/FieldRenderer';
import { ProgressBar } from '../components/ProgressBar';
import { ReviewSummary } from '../components/ReviewSummary';
import { StepActions } from '../components/StepActions';
import { StepRail } from '../components/StepRail';
import { useForm } from '../context/FormContext';
import styles from './CommissionFormPage.module.css';

export function CommissionFormPage() {
  const {
    state,
    steps,
    currentStep,
    currentStepIndex,
    setValue,
    advance,
    back,
    goToStep,
    submit,
    restoreDraft,
    discardDraft,
    dismissDraftPrompt,
  } = useForm();

  const headingRef = useRef<HTMLHeadingElement>(null);
  const [furthestIndex, setFurthestIndex] = useState(currentStepIndex);

  const isReviewStep = currentStep.id === 'review';
  const summarySteps = steps.filter((step) => step.id !== 'review');

  // Track the furthest step reached so the rail can show what is behind you.
  useEffect(() => {
    setFurthestIndex((previous) => Math.max(previous, currentStepIndex));
  }, [currentStepIndex]);

  // Move focus to the step heading whenever the step changes, so keyboard and
  // screen reader users are told that the context has changed.
  useEffect(() => {
    headingRef.current?.focus();
  }, [currentStepIndex]);

  function focusField(fieldName: string) {
    const element = document.getElementById(fieldName);
    if (element instanceof HTMLElement) {
      element.focus();
    }
  }

  function handleContinue() {
    if (isReviewStep) {
      void submit();
      return;
    }

    const advanced = advance();

    if (!advanced) {
      // Move focus to the first invalid field so the failure is actionable.
      const firstError = Object.keys(state.errors)[0];
      if (firstError) {
        requestAnimationFrame(() => focusField(firstError));
      }
    }
  }

  function handleBack() {
    back();
  }

  return (
    <div className={styles.page}>
      <a href="#form" className={styles.skipLink}>
        Skip to the form
      </a>

      <header className={styles.masthead}>
        <div className={styles.mastheadInner}>
          <div className={styles.wordmark}>
            <svg
              className={styles.mark}
              viewBox="0 0 40 40"
              role="img"
              aria-label="Atelier mark"
            >
              <rect
                x="1"
                y="1"
                width="38"
                height="38"
                rx="4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{ color: 'var(--brass)' }}
              />
              <path
                d="M11 29 L20 11 L29 29 M15 23 H25"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: 'var(--ink)' }}
              />
            </svg>

            <span className={styles.wordmarkText}>
              <span className={styles.wordmarkName} role="heading" aria-level={1}>
                Atelier
              </span>
              <span className={styles.wordmarkTag}>Joinery &amp; Furniture</span>
            </span>
          </div>

          <div className={styles.mastheadProgress}>
            <ProgressBar completed={currentStepIndex + 1} total={steps.length} />
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        <StepRail steps={steps} currentIndex={currentStepIndex} furthestIndex={furthestIndex} />

        <main className={styles.main} id="form">
          <form
            className={styles.sheet}
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              handleContinue();
            }}
          >
            {state.draftAvailable && (
              <div className={styles.draftPrompt} role="status">
                <p className={styles.draftText}>
                  We found a saved draft of this request. Would you like to carry on from
                  where you left off?
                </p>
                <div className={styles.draftActions}>
                  <button
                    type="button"
                    className={`${styles.draftButton} ${styles.draftButtonPrimary}`}
                    onClick={restoreDraft}
                  >
                    Continue draft
                  </button>
                  <button
                    type="button"
                    className={styles.draftButton}
                    onClick={discardDraft}
                  >
                    Start fresh
                  </button>
                  <button
                    type="button"
                    className={styles.draftButton}
                    onClick={dismissDraftPrompt}
                  >
                    Not now
                  </button>
                </div>
              </div>
            )}

            {state.submitError && (
              <div className={styles.submitError} role="alert">
                <span aria-hidden="true">!</span>
                <span>
                  {state.submitError} Your answers are still here — nothing has been lost.
                </span>
              </div>
            )}

            <div key={currentStep.id} className={styles.enter}>
              <h2
                ref={headingRef}
                tabIndex={-1}
                className={styles.stepHeading}
              >
                {currentStep.title}
              </h2>
              <p className={styles.stepIntro}>{currentStep.intro}</p>

              {Object.keys(state.errors).length > 0 && (
                <div className={styles.summaryWrap}>
                  <ErrorSummary
                    fields={currentStep.fields}
                    errors={state.errors}
                    onFocusField={focusField}
                  />
                </div>
              )}

              {isReviewStep ? (
                <>
                  <ReviewSummary
                    steps={steps}
                    summarySteps={summarySteps}
                    values={state.values}
                    onEditStep={goToStep}
                  />

                  <div className={styles.consentWrap}>
                    {currentStep.fields.map((field) => (
                      <FieldRenderer
                        key={field.name}
                        field={field}
                        value={state.values[field.name]}
                        errors={state.errors[field.name]}
                        onChange={(value) => setValue(field.name, value)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className={styles.fields}>
                  {currentStep.fields.map((field) => (
                    <div
                      key={field.name}
                      className={
                        field.wide
                          ? `${styles.field} ${styles.fieldWide}`
                          : styles.field
                      }
                    >
                      <FieldRenderer
                        field={field}
                        value={state.values[field.name]}
                        errors={state.errors[field.name]}
                        onChange={(value) => setValue(field.name, value)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <StepActions
              isFirstStep={currentStepIndex === 0}
              isLastStep={isReviewStep}
              busy={state.status === 'submitting'}
              onBack={handleBack}
              onContinue={handleContinue}
            />
          </form>
        </main>
      </div>

      <footer className={styles.footer}>
        Atelier Joinery — a demonstration form. Nothing you enter is sent anywhere.
      </footer>
    </div>
  );
}

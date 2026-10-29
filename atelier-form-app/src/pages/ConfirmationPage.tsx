import { useForm } from '../context/FormContext';
import styles from './ConfirmationPage.module.css';

/** Shown once a request has been submitted successfully. */
export function ConfirmationPage() {
  const { state, startNewRequest } = useForm();

  return (
    <div className={styles.page}>
      <div className={styles.sheet}>
        <div className={styles.seal} aria-hidden="true">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12.5 9 17.5 20 6.5" />
          </svg>
        </div>

        <h1 className={styles.title}>Your request is with the studio</h1>

        <p className={styles.body}>
          Thank you — your commission request has been recorded. We read every enquiry
          ourselves and will reply within two working days to confirm the specification and
          the price.
        </p>

        <div className={styles.reference}>
          <span className={styles.referenceLabel}>Your reference</span>
          <span className={styles.referenceValue}>{state.reference}</span>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.button} onClick={startNewRequest}>
            Start a new request
          </button>
        </div>

        <p className={styles.note}>
          This is a demonstration form — the request was not sent to a server.
        </p>
      </div>
    </div>
  );
}

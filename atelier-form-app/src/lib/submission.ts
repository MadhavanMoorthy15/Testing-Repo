/**
 * Submission.
 *
 * The application has no backend, so submitting runs a local routine that
 * resolves with a reference number. The failure path is exercised too, so the
 * behaviour of a failed submission — errors reported, answers kept — is real
 * rather than theoretical.
 */

export interface SubmissionResult {
  reference: string;
}

export class SubmissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SubmissionError';
  }
}

function buildReference(): string {
  const now = new Date();
  const stamp = [
    now.getFullYear().toString().slice(-2),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');
  const suffix = Math.floor(Math.random() * 9000 + 1000);
  return `CR-${stamp}-${suffix}`;
}

/**
 * Submit the request.
 *
 * @param shouldFail When true the submission rejects, exercising the failure path.
 */
export function submitRequest(shouldFail = false): Promise<SubmissionResult> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new SubmissionError('The studio could not be reached. Please try again.'));
        return;
      }
      resolve({ reference: buildReference() });
    }, 650);
  });
}

import type { FormValues } from '../types/form';

/**
 * Draft persistence.
 *
 * The draft is a small JSON blob stored under one key, so it can be located
 * and removed deterministically. Storage failures are tolerated: the form
 * keeps working in memory when `localStorage` is unavailable.
 */

/** The single key the commission request draft is stored under. */
export const DRAFT_KEY = 'atelier-form-app:commission-request-draft';

export interface DraftPayload {
  values: FormValues;
  stepIndex: number;
  savedAt: string;
}

function getStorage(): Storage | null {
  try {
    const storage = window.localStorage;
    // Touching `storage` can throw in some privacy modes.
    const probe = '__atelier_probe__';
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    return storage;
  } catch {
    return null;
  }
}

/** Write a draft. Returns false when storage is unavailable. */
export function saveDraft(values: FormValues, stepIndex: number): boolean {
  const storage = getStorage();
  if (!storage) return false;

  const payload: DraftPayload = {
    values,
    stepIndex,
    savedAt: new Date().toISOString(),
  };

  try {
    storage.setItem(DRAFT_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

/**
 * Read a draft.
 *
 * Returns `null` when nothing is stored, when the stored value cannot be
 * parsed, or when it does not look like a draft. A corrupt draft is removed
 * so it cannot block the form on the next visit.
 */
export function loadDraft(): DraftPayload | null {
  const storage = getStorage();
  if (!storage) return null;

  let raw: string | null;
  try {
    raw = storage.getItem(DRAFT_KEY);
  } catch {
    return null;
  }

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<DraftPayload>;

    const values =
      parsed.values && typeof parsed.values === 'object' ? parsed.values : null;
    const stepIndex =
      typeof parsed.stepIndex === 'number' && Number.isFinite(parsed.stepIndex)
        ? parsed.stepIndex
        : null;

    if (!values || stepIndex === null) {
      clearDraft();
      return null;
    }

    return {
      values: values as FormValues,
      stepIndex,
      savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : '',
    };
  } catch {
    clearDraft();
    return null;
  }
}

/** Remove the stored draft. */
export function clearDraft(): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.removeItem(DRAFT_KEY);
  } catch {
    // Nothing useful to do — the draft is a convenience, not a guarantee.
  }
}

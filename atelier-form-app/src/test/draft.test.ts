import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { clearDraft, DRAFT_KEY, loadDraft, saveDraft } from '../lib/draft';

describe('draft', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('stores the answers and the current step under one key', () => {
    saveDraft({ fullName: 'Ada', features: ['handles'] }, 2);

    const raw = window.localStorage.getItem(DRAFT_KEY);
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw as string);
    expect(parsed.values).toEqual({ fullName: 'Ada', features: ['handles'] });
    expect(parsed.stepIndex).toBe(2);
  });

  it('round-trips a saved draft', () => {
    saveDraft({ fullName: 'Ada' }, 1);

    const draft = loadDraft();
    expect(draft?.values).toEqual({ fullName: 'Ada' });
    expect(draft?.stepIndex).toBe(1);
  });

  it('returns null when nothing is stored', () => {
    expect(loadDraft()).toBeNull();
  });

  it('removes the draft when cleared', () => {
    saveDraft({ fullName: 'Ada' }, 1);
    clearDraft();

    expect(window.localStorage.getItem(DRAFT_KEY)).toBeNull();
    expect(loadDraft()).toBeNull();
  });

  it('discards and removes a corrupt draft', () => {
    window.localStorage.setItem(DRAFT_KEY, '{not valid json');

    expect(loadDraft()).toBeNull();
    expect(window.localStorage.getItem(DRAFT_KEY)).toBeNull();
  });

  it('discards a draft that is missing its step index', () => {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ values: { a: 'b' } }));

    expect(loadDraft()).toBeNull();
    expect(window.localStorage.getItem(DRAFT_KEY)).toBeNull();
  });

  it('only removes its own key when cleared', () => {
    window.localStorage.setItem('unrelated', 'keep me');
    saveDraft({ fullName: 'Ada' }, 1);

    clearDraft();

    expect(window.localStorage.getItem('unrelated')).toBe('keep me');
  });

  describe('when storage is unavailable', () => {
    it('does not throw when saving', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => saveDraft({ fullName: 'Ada' }, 0)).not.toThrow();
    });

    it('returns null when loading', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });

      expect(loadDraft()).toBeNull();
    });

    it('does not throw when clearing', () => {
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });

      expect(() => clearDraft()).not.toThrow();
    });
  });
});

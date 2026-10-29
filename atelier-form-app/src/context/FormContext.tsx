import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { STEPS } from '../lib/formSchema';
import { clearDraft, loadDraft, saveDraft } from '../lib/draft';
import { submitRequest } from '../lib/submission';
import { validateAllSteps, validateStep } from '../lib/validation';
import { createInitialState, formReducer } from './formReducer';
import type { FormState } from './formReducer';
import type { StepDefinition } from '../types/form';

interface FormContextValue {
  state: FormState;
  steps: StepDefinition[];
  currentStep: StepDefinition;
  currentStepIndex: number;
  setValue: (name: string, value: string | string[] | boolean) => void;
  /** Validate the current step and move forward. Returns true when it advanced. */
  advance: () => boolean;
  back: () => void;
  goToStep: (index: number) => void;
  submit: (options?: { shouldFail?: boolean }) => Promise<void>;
  restoreDraft: () => void;
  discardDraft: () => void;
  dismissDraftPrompt: () => void;
  startNewRequest: () => void;
}

const FormContext = createContext<FormContextValue | null>(null);

const AUTOSAVE_DELAY_MS = 300;

export function FormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, undefined, createInitialState);
  const [draftAvailable, setDraftAvailable] = useState(false);
  const pendingSave = useRef<number | null>(null);

  // Look for a saved draft on first mount.
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setDraftAvailable(true);
    }
  }, []);

  // Autosave the answers and the current step.
  useEffect(() => {
    if (state.status === 'submitted') return;

    if (pendingSave.current !== null) {
      window.clearTimeout(pendingSave.current);
    }

    pendingSave.current = window.setTimeout(() => {
      saveDraft(state.values, state.stepIndex);
      pendingSave.current = null;
    }, AUTOSAVE_DELAY_MS);

    return () => {
      if (pendingSave.current !== null) {
        window.clearTimeout(pendingSave.current);
        pendingSave.current = null;
      }
    };
  }, [state.values, state.stepIndex, state.status]);

  // Flush a pending write if the page goes away.
  useEffect(() => {
    const flush = () => {
      if (pendingSave.current !== null) {
        window.clearTimeout(pendingSave.current);
        pendingSave.current = null;
        saveDraft(state.values, state.stepIndex);
      }
    };

    window.addEventListener('beforeunload', flush);
    return () => window.removeEventListener('beforeunload', flush);
  }, [state.values, state.stepIndex]);

  const setValue = useCallback(
    (name: string, value: string | string[] | boolean) => {
      dispatch({ type: 'SET_VALUE', name, value });
    },
    [],
  );

  const advance = useCallback(() => {
    const step = STEPS[state.stepIndex];
    const errors = validateStep(step.fields, state.values);

    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', errors });
      return false;
    }

    dispatch({ type: 'ADVANCE', stepIndex: Math.min(state.stepIndex + 1, STEPS.length - 1) });
    return true;
  }, [state.stepIndex, state.values]);

  const back = useCallback(() => {
    dispatch({ type: 'BACK', stepIndex: Math.max(state.stepIndex - 1, 0) });
  }, [state.stepIndex]);

  const goToStep = useCallback((index: number) => {
    if (index < 0 || index >= STEPS.length) return;
    dispatch({ type: 'GO_TO_STEP', stepIndex: index });
  }, []);

  const submit = useCallback(
    async (options?: { shouldFail?: boolean }) => {
      const errors = validateAllSteps(STEPS, state.values);

      if (Object.keys(errors).length > 0) {
        // Jump to the first step that has a problem and show its errors.
        const firstInvalidIndex = STEPS.findIndex((step) => errors[step.id]);
        const firstInvalidStep = STEPS[firstInvalidIndex];

        if (firstInvalidStep) {
          dispatch({ type: 'GO_TO_STEP', stepIndex: firstInvalidIndex });
          dispatch({ type: 'SET_ERRORS', errors: errors[firstInvalidStep.id] });
        }
        return;
      }

      dispatch({ type: 'SUBMIT_START' });

      try {
        const result = await submitRequest(options?.shouldFail ?? false);
        clearDraft();
        dispatch({ type: 'SUBMIT_SUCCESS', reference: result.reference });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Something went wrong while sending your request.';
        dispatch({ type: 'SUBMIT_FAILURE', message });
      }
    },
    [state.values],
  );

  const restoreDraft = useCallback(() => {
    const draft = loadDraft();
    if (!draft) {
      setDraftAvailable(false);
      dispatch({ type: 'DISMISS_DRAFT_PROMPT' });
      return;
    }

    const stepIndex = Math.min(Math.max(draft.stepIndex, 0), STEPS.length - 1);
    dispatch({ type: 'RESTORE_DRAFT', values: draft.values, stepIndex });
    setDraftAvailable(false);
  }, []);

  const discardDraft = useCallback(() => {
    clearDraft();
    dispatch({ type: 'DISCARD_DRAFT' });
    setDraftAvailable(false);
  }, []);

  const dismissDraftPrompt = useCallback(() => {
    setDraftAvailable(false);
    dispatch({ type: 'DISMISS_DRAFT_PROMPT' });
  }, []);

  const startNewRequest = useCallback(() => {
    clearDraft();
    dispatch({ type: 'RESET' });
    setDraftAvailable(false);
  }, []);

  const value = useMemo<FormContextValue>(
    () => ({
      state: { ...state, draftAvailable },
      steps: STEPS,
      currentStep: STEPS[state.stepIndex],
      currentStepIndex: state.stepIndex,
      setValue,
      advance,
      back,
      goToStep,
      submit,
      restoreDraft,
      discardDraft,
      dismissDraftPrompt,
      startNewRequest,
    }),
    [
      state,
      draftAvailable,
      setValue,
      advance,
      back,
      goToStep,
      submit,
      restoreDraft,
      discardDraft,
      dismissDraftPrompt,
      startNewRequest,
    ],
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useForm(): FormContextValue {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used inside a FormProvider.');
  }
  return context;
}

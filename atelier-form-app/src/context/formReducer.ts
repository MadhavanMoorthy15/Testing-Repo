import type { FormValues, ValidationErrors } from '../types/form';
import { validateField } from '../lib/validation';
import { STEPS } from '../lib/formSchema';

export interface FormState {
  values: FormValues;
  /** Index into the step list of the step currently displayed. */
  stepIndex: number;
  /** Errors for the current step, keyed by field name. */
  errors: ValidationErrors;
  /** Fields that have been shown as invalid, so errors clear on correction. */
  touched: string[];
  /** True once a draft has been restored from storage. */
  draftRestored: boolean;
  /** True when a draft was found and the user has not yet chosen. */
  draftAvailable: boolean;
  status: 'editing' | 'submitting' | 'submitted';
  /** The reference returned by a successful submission. */
  reference: string | null;
  /** The message from a failed submission. */
  submitError: string | null;
}

export type FormAction =
  | { type: 'SET_VALUE'; name: string; value: string | string[] | boolean }
  | { type: 'SET_ERRORS'; errors: ValidationErrors }
  | { type: 'CLEAR_FIELD_ERROR'; name: string }
  | { type: 'ADVANCE'; stepIndex: number }
  | { type: 'BACK'; stepIndex: number }
  | { type: 'GO_TO_STEP'; stepIndex: number }
  | { type: 'RESTORE_DRAFT'; values: FormValues; stepIndex: number }
  | { type: 'DISMISS_DRAFT_PROMPT' }
  | { type: 'DISCARD_DRAFT' }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS'; reference: string }
  | { type: 'SUBMIT_FAILURE'; message: string }
  | { type: 'RESET' };

export function createInitialState(): FormState {
  return {
    values: {},
    stepIndex: 0,
    errors: {},
    touched: [],
    draftRestored: false,
    draftAvailable: false,
    status: 'editing',
    reference: null,
    submitError: null,
  };
}

/** Look up a field definition by name across every step. */
function findField(name: string) {
  for (const step of STEPS) {
    const field = step.fields.find((candidate) => candidate.name === name);
    if (field) return field;
  }
  return undefined;
}

export function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_VALUE': {
      const values = { ...state.values, [action.name]: action.value };

      // Once a field has failed, it is revalidated on every change so the
      // error disappears as soon as the value becomes valid.
      if (state.touched.includes(action.name)) {
        const field = findField(action.name);
        if (field) {
          const messages = validateField(values[action.name], field.rules);
          const errors = { ...state.errors };
          if (messages.length > 0) {
            errors[action.name] = messages;
          } else {
            delete errors[action.name];
          }
          return { ...state, values, errors };
        }
      }

      return { ...state, values };
    }

    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
        touched: Array.from(
          new Set([...state.touched, ...Object.keys(action.errors)]),
        ),
      };

    case 'CLEAR_FIELD_ERROR': {
      const errors = { ...state.errors };
      delete errors[action.name];
      return { ...state, errors };
    }

    case 'ADVANCE':
      return { ...state, stepIndex: action.stepIndex, errors: {}, touched: [] };

    case 'BACK':
      return { ...state, stepIndex: action.stepIndex, errors: {}, touched: [] };

    case 'GO_TO_STEP':
      return { ...state, stepIndex: action.stepIndex, errors: {}, touched: [] };

    case 'RESTORE_DRAFT':
      return {
        ...state,
        values: action.values,
        stepIndex: action.stepIndex,
        draftRestored: true,
        draftAvailable: false,
        errors: {},
        touched: [],
      };

    case 'DISMISS_DRAFT_PROMPT':
      return { ...state, draftAvailable: false };

    case 'DISCARD_DRAFT':
      return {
        ...createInitialState(),
        values: state.values,
        draftRestored: false,
        draftAvailable: false,
      };

    case 'SUBMIT_START':
      return { ...state, status: 'submitting', submitError: null };

    case 'SUBMIT_SUCCESS':
      return { ...state, status: 'submitted', reference: action.reference };

    case 'SUBMIT_FAILURE':
      return { ...state, status: 'editing', submitError: action.message };

    case 'RESET':
      return createInitialState();

    default:
      return state;
  }
}

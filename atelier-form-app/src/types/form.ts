/**
 * Core form types.
 *
 * A form is described by a list of steps, each holding a list of field
 * definitions. Every field carries its own validation rules, so the same
 * definition drives rendering, validation, the review summary and the draft.
 */

export type FieldKind =
  | 'text'
  | 'email'
  | 'tel'
  | 'url'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox-group'
  | 'checkbox';

export type Rule =
  | { type: 'required'; message: string }
  | { type: 'minLength'; value: number; message: string }
  | { type: 'maxLength'; value: number; message: string }
  | { type: 'email'; message: string }
  | { type: 'url'; message: string }
  | { type: 'min'; value: number; message: string }
  | { type: 'max'; value: number; message: string }
  | { type: 'minSelected'; value: number; message: string };

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldDefinition {
  name: string;
  kind: FieldKind;
  label: string;
  /** Short guidance shown under the control. */
  hint?: string;
  /** Placeholder text for text-like controls. */
  placeholder?: string;
  /** Options for `select`, `radio` and `checkbox-group` controls. */
  options?: FieldOption[];
  /** Validation rules applied to this field, in order. */
  rules: Rule[];
  /** Used for radio groups and checkbox groups to group their options. */
  groupLabel?: string;
  /** Renders the field across the full width of the sheet. */
  wide?: boolean;
}

export interface StepDefinition {
  id: string;
  /** Short name used in the progress rail. */
  name: string;
  /** Sentence shown under the step name in the rail. */
  caption: string;
  /** Heading shown at the top of the step. */
  title: string;
  /** Supporting sentence shown under the step heading. */
  intro: string;
  fields: FieldDefinition[];
}

/** Values are keyed by field name. Scalars are stored as strings. */
export type FormValues = Record<string, string | string[] | boolean>;

export type ValidationErrors = Record<string, string[]>;

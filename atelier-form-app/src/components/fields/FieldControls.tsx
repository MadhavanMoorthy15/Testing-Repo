import { FieldShell } from './FieldShell';
import controlStyles from './Control.module.css';
import groupStyles from './Group.module.css';
import type { FieldDefinition } from '../../types/form';

interface TextFieldProps {
  field: FieldDefinition;
  value: string;
  errors?: string[];
  onChange: (value: string) => void;
}

/** Renders text, email, tel, url and number inputs. */
export function TextField({ field, value, errors, onChange }: TextFieldProps) {
  const isNumber = field.kind === 'number';
  const inputType =
    field.kind === 'text'
      ? 'text'
      : field.kind === 'number'
        ? 'number'
        : field.kind;

  const isRequired = field.rules.some((rule) => rule.type === 'required');
  const maxLengthRule = field.rules.find((rule) => rule.type === 'maxLength');
  const minLengthRule = field.rules.find((rule) => rule.type === 'minLength');
  const counter =
    maxLengthRule && minLengthRule
      ? { current: value.trim().length, max: maxLengthRule.value }
      : undefined;

  return (
    <FieldShell
      fieldId={field.name}
      label={field.label}
      hint={field.hint}
      errors={errors}
      required={isRequired}
      counter={counter}
    >
      <input
        type={inputType}
        inputMode={field.kind === 'tel' ? 'tel' : isNumber ? 'numeric' : undefined}
        min={isNumber ? extractRuleValue(field, 'min') : undefined}
        max={isNumber ? extractRuleValue(field, 'max') : undefined}
        step={isNumber ? 'any' : undefined}
        className={controlStyles.control}
        placeholder={field.placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldShell>
  );
}

interface TextAreaFieldProps {
  field: FieldDefinition;
  value: string;
  errors?: string[];
  onChange: (value: string) => void;
}

/** Renders multi-line text fields. */
export function TextAreaField({ field, value, errors, onChange }: TextAreaFieldProps) {
  const isRequired = field.rules.some((rule) => rule.type === 'required');
  const maxLengthRule = field.rules.find((rule) => rule.type === 'maxLength');
  const counter = maxLengthRule
    ? { current: value.trim().length, max: maxLengthRule.value }
    : undefined;

  return (
    <FieldShell
      fieldId={field.name}
      label={field.label}
      hint={field.hint}
      errors={errors}
      required={isRequired}
      counter={counter}
    >
      <textarea
        className={controlStyles.control}
        placeholder={field.placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={5}
      />
    </FieldShell>
  );
}

interface SelectFieldProps {
  field: FieldDefinition;
  value: string;
  errors?: string[];
  onChange: (value: string) => void;
}

/** Renders a single-select dropdown. */
export function SelectField({ field, value, errors, onChange }: SelectFieldProps) {
  const isRequired = field.rules.some((rule) => rule.type === 'required');
  const id = field.name;

  return (
    <FieldShell
      fieldId={id}
      label={field.label}
      hint={field.hint}
      errors={errors}
      required={isRequired}
    >
      <select
        className={controlStyles.control}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {field.placeholder && (
          <option value="" disabled>
            {field.placeholder}
          </option>
        )}
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

interface RadioGroupFieldProps {
  field: FieldDefinition;
  value: string;
  errors?: string[];
  onChange: (value: string) => void;
}

/** Renders a radio group, grouped with `fieldset`/`legend`. */
export function RadioGroupField({ field, value, errors, onChange }: RadioGroupFieldProps) {
  const isRequired = field.rules.some((rule) => rule.type === 'required');
  const invalid = Boolean(errors && errors.length > 0);

  return (
    <fieldset
      className={groupStyles.group}
      aria-invalid={invalid || undefined}
      aria-describedby={errors && errors.length > 0 ? `${field.name}-error` : undefined}
    >
      <legend className={groupStyles.legend}>{field.groupLabel ?? field.label}</legend>

      {field.hint && (
        <p id={`${field.name}-hint`} className={groupStyles.hint}>
          {field.hint}
        </p>
      )}

      <div className={groupStyles.grid}>
        {field.options?.map((option) => {
          const optionId = `${field.name}-${option.value}`;
          const checked = value === option.value;
          return (
            <label key={option.value} htmlFor={optionId} className={groupStyles.option}>
              <input
                id={optionId}
                type="radio"
                name={field.name}
                value={option.value}
                checked={checked}
                className={groupStyles.optionInput}
                aria-required={isRequired || undefined}
                onChange={(event) => onChange(event.target.value)}
              />
              <span className={groupStyles.optionLabel}>{option.label}</span>
            </label>
          );
        })}
      </div>

      {errors && errors.length > 0 && (
        <p id={`${field.name}-error`} role="alert" className={groupStyles.groupError}>
          <span className="visually-hidden">Error:</span>
          {errors[0]}
        </p>
      )}
    </fieldset>
  );
}

interface CheckboxGroupFieldProps {
  field: FieldDefinition;
  value: string[];
  errors?: string[];
  onChange: (value: string[]) => void;
}

/** Renders a checkbox group, grouped with `fieldset`/`legend`. */
export function CheckboxGroupField({ field, value, errors, onChange }: CheckboxGroupFieldProps) {
  const invalid = Boolean(errors && errors.length > 0);
  const minSelectedRule = field.rules.find((rule) => rule.type === 'minSelected');
  const required = field.rules.some((rule) => rule.type === 'required');

  function toggle(option: string) {
    const next = value.includes(option)
      ? value.filter((entry) => entry !== option)
      : [...value, option];
    onChange(next);
  }

  return (
    <fieldset
      className={groupStyles.group}
      aria-invalid={invalid || undefined}
      aria-describedby={errors && errors.length > 0 ? `${field.name}-error` : undefined}
    >
      <legend className={groupStyles.legend}>{field.groupLabel ?? field.label}</legend>

      {field.hint && (
        <p id={`${field.name}-hint`} className={groupStyles.hint}>
          {field.hint}
        </p>
      )}

      <div className={groupStyles.grid}>
        {field.options?.map((option) => {
          const optionId = `${field.name}-${option.value}`;
          const checked = value.includes(option.value);
          return (
            <label key={option.value} htmlFor={optionId} className={groupStyles.option}>
              <input
                id={optionId}
                type="checkbox"
                value={option.value}
                checked={checked}
                className={groupStyles.optionInput}
                aria-required={required || undefined}
                onChange={() => toggle(option.value)}
              />
              <span className={groupStyles.optionLabel}>{option.label}</span>
            </label>
          );
        })}
      </div>

      {errors && errors.length > 0 && (
        <p id={`${field.name}-error`} role="alert" className={groupStyles.groupError}>
          <span className="visually-hidden">Error:</span>
          {errors[0]}
        </p>
      )}

      {minSelectedRule && !invalid && value.length > 0 && (
        <p className={groupStyles.selectionCount}>
          {value.length} selected
        </p>
      )}
    </fieldset>
  );
}

interface CheckboxFieldProps {
  field: FieldDefinition;
  value: boolean;
  errors?: string[];
  onChange: (value: boolean) => void;
}

/** Renders a single consent checkbox with a label that wraps the control. */
export function CheckboxField({ field, value, errors, onChange }: CheckboxFieldProps) {
  const isRequired = field.rules.some((rule) => rule.type === 'required');
  const invalid = Boolean(errors && errors.length > 0);

  return (
    <fieldset
      className={groupStyles.group}
      aria-invalid={invalid || undefined}
      aria-describedby={errors && errors.length > 0 ? `${field.name}-error` : undefined}
    >
      <legend className="visually-hidden">{field.label}</legend>

      <label htmlFor={field.name} className={groupStyles.option}>
        <input
          id={field.name}
          type="checkbox"
          checked={value}
          aria-required={isRequired || undefined}
          className={groupStyles.optionInput}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className={groupStyles.optionLabel}>{field.label}</span>
      </label>

      {errors && errors.length > 0 && (
        <p id={`${field.name}-error`} role="alert" className={groupStyles.groupError}>
          <span className="visually-hidden">Error:</span>
          {errors[0]}
        </p>
      )}
    </fieldset>
  );
}

/** Read a numeric rule value if present, otherwise undefined. */
function extractRuleValue(field: FieldDefinition, type: 'min' | 'max'): number | undefined {
  const rule = field.rules.find((rule) => rule.type === type);
  return rule && rule.type === type ? rule.value : undefined;
}

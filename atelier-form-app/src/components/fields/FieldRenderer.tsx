import {
  CheckboxField,
  CheckboxGroupField,
  RadioGroupField,
  SelectField,
  TextAreaField,
  TextField,
} from './FieldControls';
import type { FieldDefinition } from '../../types/form';

interface FieldRendererProps {
  field: FieldDefinition;
  value: string | string[] | boolean | undefined;
  errors?: string[];
  onChange: (value: string | string[] | boolean) => void;
}

/**
 * Renders the control that matches a field's kind.
 *
 * This is the only place that maps a field kind to a component, so a new
 * control is added by extending the switch and `FieldKind` together.
 */
export function FieldRenderer({ field, value, errors, onChange }: FieldRendererProps) {
  switch (field.kind) {
    case 'textarea':
      return (
        <TextAreaField
          field={field}
          value={asString(value)}
          errors={errors}
          onChange={onChange}
        />
      );

    case 'select':
      return (
        <SelectField
          field={field}
          value={asString(value)}
          errors={errors}
          onChange={onChange}
        />
      );

    case 'radio':
      return (
        <RadioGroupField
          field={field}
          value={asString(value)}
          errors={errors}
          onChange={onChange}
        />
      );

    case 'checkbox-group':
      return (
        <CheckboxGroupField
          field={field}
          value={asArray(value)}
          errors={errors}
          onChange={onChange}
        />
      );

    case 'checkbox':
      return (
        <CheckboxField
          field={field}
          value={value === true}
          errors={errors}
          onChange={onChange}
        />
      );

    case 'text':
    case 'email':
    case 'tel':
    case 'url':
    case 'number':
    default:
      return (
        <TextField
          field={field}
          value={asString(value)}
          errors={errors}
          onChange={onChange}
        />
      );
  }
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function asArray(value: unknown): string[] {
  return Array.isArray(value) ? value : [];
}

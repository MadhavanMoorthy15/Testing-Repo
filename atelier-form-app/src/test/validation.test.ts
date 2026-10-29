import { describe, expect, it } from 'vitest';

import { validateField, validateStep } from '../lib/validation';
import type { FieldDefinition, Rule } from '../types/form';

const required: Rule = { type: 'required', message: 'This is required.' };

describe('validateField', () => {
  it('accepts a value that satisfies every rule', () => {
    const rules: Rule[] = [
      required,
      { type: 'minLength', value: 3, message: 'Too short.' },
      { type: 'email', message: 'Not an email.' },
    ];

    expect(validateField('a@b.co', rules)).toEqual([]);
  });

  it('reports every failing rule, in rule order', () => {
    const rules: Rule[] = [
      { type: 'email', message: 'Not an email.' },
      { type: 'minLength', value: 5, message: 'Too short.' },
    ];

    expect(validateField('a@b', rules)).toEqual(['Not an email.', 'Too short.']);
  });

  describe('required', () => {
    it.each([
      ['an empty string', ''],
      ['a whitespace-only string', '   '],
      ['undefined', undefined],
      ['null', null],
    ])('rejects %s', (_label, value) => {
      expect(validateField(value, [required])).toEqual(['This is required.']);
    });

    it('rejects an empty array', () => {
      expect(validateField([], [required])).toEqual(['This is required.']);
    });

    it('rejects a false checkbox', () => {
      expect(validateField(false, [required])).toEqual(['This is required.']);
    });

    it('accepts a non-empty value', () => {
      expect(validateField('yes', [required])).toEqual([]);
    });
  });

  describe('minLength', () => {
    const rule: Rule = { type: 'minLength', value: 3, message: 'Too short.' };

    it('rejects a value below the minimum', () => {
      expect(validateField('ab', [rule])).toEqual(['Too short.']);
    });

    it('accepts a value exactly at the minimum', () => {
      expect(validateField('abc', [rule])).toEqual([]);
    });

    it('does not apply to an empty optional value', () => {
      expect(validateField('', [rule])).toEqual([]);
    });
  });

  describe('maxLength', () => {
    const rule: Rule = { type: 'maxLength', value: 5, message: 'Too long.' };

    it('rejects a value above the maximum', () => {
      expect(validateField('abcdef', [rule])).toEqual(['Too long.']);
    });

    it('accepts a value exactly at the maximum', () => {
      expect(validateField('abcde', [rule])).toEqual([]);
    });
  });

  describe('email', () => {
    const rule: Rule = { type: 'email', message: 'Not an email.' };

    it.each([
      ['missing an @', 'example.com'],
      ['missing a domain', 'user@'],
      ['missing a tld', 'user@example'],
      ['containing a space', 'user name@example.com'],
    ])('rejects an address %s', (_label, value) => {
      expect(validateField(value, [rule])).toEqual(['Not an email.']);
    });

    it.each([
      ['user@example.com'],
      ['first.last@example.co.uk'],
    ])('accepts %s', (value) => {
      expect(validateField(value, [rule])).toEqual([]);
    });
  });

  describe('url', () => {
    const rule: Rule = { type: 'url', message: 'Not a URL.' };

    it.each([['example.com'], ['ftp://example.com'], ['www.example.com']])(
      'rejects %s',
      (value) => {
        expect(validateField(value, [rule])).toEqual(['Not a URL.']);
      },
    );

    it.each([['https://example.com'], ['http://example.co.uk/path']])(
      'accepts %s',
      (value) => {
        expect(validateField(value, [rule])).toEqual([]);
      },
    );
  });

  describe('min and max', () => {
    const min: Rule = { type: 'min', value: 10, message: 'Too small.' };
    const max: Rule = { type: 'max', value: 100, message: 'Too large.' };

    it('rejects a value below the minimum', () => {
      expect(validateField(9, [min])).toEqual(['Too small.']);
    });

    it('accepts a value at the minimum', () => {
      expect(validateField(10, [min])).toEqual([]);
    });

    it('rejects a value above the maximum', () => {
      expect(validateField(101, [max])).toEqual(['Too large.']);
    });

    it('accepts a value at the maximum', () => {
      expect(validateField(100, [max])).toEqual([]);
    });

    it('accepts a numeric string', () => {
      expect(validateField('50', [min, max])).toEqual([]);
    });

    it('rejects a non-numeric string that is not empty', () => {
      expect(validateField('wide', [min])).toEqual(['Too small.']);
    });

    it('does not apply to an empty optional value', () => {
      expect(validateField('', [min, max])).toEqual([]);
    });
  });

  describe('minSelected', () => {
    const rule: Rule = { type: 'minSelected', value: 1, message: 'Pick one.' };

    it('rejects an empty selection', () => {
      expect(validateField([], [rule])).toEqual(['Pick one.']);
    });

    it('accepts a single selection', () => {
      expect(validateField(['one'], [rule])).toEqual([]);
    });

    it('accepts more selections than the minimum', () => {
      expect(validateField(['one', 'two'], [rule])).toEqual([]);
    });
  });
});

describe('validateStep', () => {
  const fields: FieldDefinition[] = [
    { name: 'name', kind: 'text', label: 'Name', rules: [required] },
    {
      name: 'email',
      kind: 'email',
      label: 'Email',
      rules: [{ type: 'email', message: 'Not an email.' }],
    },
    {
      name: 'notes',
      kind: 'textarea',
      label: 'Notes',
      rules: [{ type: 'maxLength', value: 5, message: 'Too long.' }],
    },
  ];

  it('returns no errors when every field is valid', () => {
    const errors = validateStep(fields, { name: 'Ada', email: 'ada@example.com', notes: 'Hi' });

    expect(errors).toEqual({});
  });

  it('keys errors by field name', () => {
    const errors = validateStep(fields, { name: '', email: 'nope' });

    expect(Object.keys(errors).sort()).toEqual(['email', 'name']);
    expect(errors.name).toEqual(['This is required.']);
    expect(errors.email).toEqual(['Not an email.']);
  });

  it('omits fields without errors', () => {
    const errors = validateStep(fields, { name: 'Ada', email: 'ada@example.com' });

    expect(errors).not.toHaveProperty('notes');
  });

  it('does not report an empty optional field', () => {
    const errors = validateStep(fields, { name: 'Ada', email: 'ada@example.com', notes: '' });

    expect(errors).toEqual({});
  });

  it('reports an optional field that has an invalid content', () => {
    const errors = validateStep(fields, {
      name: 'Ada',
      email: 'ada@example.com',
      notes: 'Far too long to be accepted',
    });

    expect(errors.notes).toEqual(['Too long.']);
  });
});

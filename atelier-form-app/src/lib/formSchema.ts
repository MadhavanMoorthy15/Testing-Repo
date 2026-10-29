import type { StepDefinition } from '../types/form';

/**
 * The commission request form, described once.
 *
 * Adding a field means adding one entry here — the control, its validation,
 * its entry in the review summary and its place in the draft all follow from
 * this definition.
 */
export const STEPS: StepDefinition[] = [
  {
    id: 'client',
    name: 'Client',
    caption: 'Who we are speaking with',
    title: 'Who are we building for?',
    intro:
      'We will use these details to confirm the brief and to arrange a site visit. Nothing here is shared outside the studio.',
    fields: [
      {
        name: 'fullName',
        kind: 'text',
        label: 'Full name',
        placeholder: 'Eleanor Whitfield',
        rules: [
          { type: 'required', message: 'Enter the name we should address you by.' },
          { type: 'minLength', value: 2, message: 'Enter at least 2 characters.' },
          { type: 'maxLength', value: 80, message: 'Keep this under 80 characters.' },
        ],
      },
      {
        name: 'email',
        kind: 'email',
        label: 'Email address',
        placeholder: 'you@example.com',
        hint: 'Drawings and the quotation arrive here.',
        rules: [
          { type: 'required', message: 'Enter an email address so we can reach you.' },
          { type: 'email', message: 'Enter a valid email address, such as you@example.com.' },
        ],
      },
      {
        name: 'phone',
        kind: 'tel',
        label: 'Phone number',
        placeholder: '+44 7700 900123',
        hint: 'Optional, but it is the quickest way to settle a question.',
        rules: [
          { type: 'maxLength', value: 24, message: 'Keep this under 24 characters.' },
        ],
      },
      {
        name: 'contactPreference',
        kind: 'radio',
        label: 'How should we get in touch?',
        groupLabel: 'How should we get in touch?',
        options: [
          { value: 'email', label: 'Email' },
          { value: 'phone', label: 'Phone call' },
          { value: 'either', label: 'Either is fine' },
        ],
        rules: [
          { type: 'required', message: 'Choose how you would prefer to be contacted.' },
        ],
      },
    ],
  },
  {
    id: 'project',
    name: 'Project',
    caption: 'What we are making',
    title: 'Tell us about the project',
    intro:
      'The more precise the brief, the more accurate the first quotation. Rough figures are fine — we will ask about the rest.',
    fields: [
      {
        name: 'projectType',
        kind: 'select',
        label: 'Type of work',
        placeholder: 'Select a type of work',
        options: [
          { value: 'kitchen', label: 'Kitchen cabinetry' },
          { value: 'wardrobe', label: 'Wardrobe and storage' },
          { value: 'furniture', label: 'Freestanding furniture' },
          { value: 'panelling', label: 'Wall panelling and joinery' },
          { value: 'repair', label: 'Repair or restoration' },
        ],
        rules: [
          { type: 'required', message: 'Select the type of work you are enquiring about.' },
        ],
      },
      {
        name: 'room',
        kind: 'text',
        label: 'Room or location',
        placeholder: 'Kitchen, ground floor',
        rules: [
          { type: 'required', message: 'Tell us which room the work is for.' },
          { type: 'maxLength', value: 60, message: 'Keep this under 60 characters.' },
        ],
      },
      {
        name: 'budgetBand',
        kind: 'select',
        label: 'Budget band',
        placeholder: 'Select a budget band',
        hint: 'Excluding installation. It helps us propose the right specification.',
        options: [
          { value: 'under-5k', label: 'Under £5,000' },
          { value: '5k-15k', label: '£5,000 – £15,000' },
          { value: '15k-40k', label: '£15,000 – £40,000' },
          { value: '40k-plus', label: 'Above £40,000' },
          { value: 'unsure', label: 'Not sure yet' },
        ],
        rules: [
          { type: 'required', message: 'Select a budget band, even if you are unsure.' },
        ],
      },
      {
        name: 'timeline',
        kind: 'text',
        label: 'Target completion',
        placeholder: 'Spring 2027',
        hint: 'A season or a month — whichever you are working to.',
        rules: [
          { type: 'required', message: 'Tell us when you hope the work will be complete.' },
          { type: 'maxLength', value: 40, message: 'Keep this under 40 characters.' },
        ],
      },
      {
        name: 'brief',
        kind: 'textarea',
        label: 'Project brief',
        placeholder: 'A peninsula run with a concealed pantry, open shelving above…',
        hint: 'Measurements, references, the awkward corner — anything that matters.',
        rules: [
          { type: 'required', message: 'Describe the work in a sentence or two.' },
          { type: 'minLength', value: 20, message: 'Please give us at least 20 characters to work with.' },
          { type: 'maxLength', value: 1200, message: 'Keep this under 1200 characters.' },
        ],
        wide: true,
      },
    ],
  },
  {
    id: 'specifications',
    name: 'Specifications',
    caption: 'Materials and dimensions',
    title: 'Materials and dimensions',
    intro:
      'Rough numbers are fine. We will confirm exact sizes against drawings before anything is cut.',
    fields: [
      {
        name: 'timber',
        kind: 'select',
        label: 'Timber species',
        placeholder: 'Select a timber',
        options: [
          { value: 'oak', label: 'English oak' },
          { value: 'walnut', label: 'American walnut' },
          { value: 'ash', label: 'European ash' },
          { value: 'cherry', label: 'Cherry' },
          { value: 'plywood', label: 'Birch plywood' },
          { value: 'unsure', label: 'Advise me' },
        ],
        rules: [
          { type: 'required', message: 'Select a timber, or choose "Advise me".' },
        ],
      },
      {
        name: 'finish',
        kind: 'radio',
        label: 'Finish',
        groupLabel: 'Finish',
        options: [
          { value: 'oiled', label: 'Hardwax oil' },
          { value: 'lacquered', label: 'Sprayed lacquer' },
          { value: 'painted', label: 'Painted' },
          { value: 'unfinished', label: 'Unfinished, to be finished on site' },
        ],
        rules: [
          { type: 'required', message: 'Choose a finish.' },
        ],
      },
      {
        name: 'longestRun',
        kind: 'number',
        label: 'Longest run or panel width',
        placeholder: '2400',
        hint: 'In millimetres. The largest single dimension we need to make.',
        rules: [
          { type: 'required', message: 'Give us the largest width you need.' },
          { type: 'min', value: 50, message: 'Enter a width of at least 50 mm.' },
          { type: 'max', value: 6000, message: 'Enter a width of 6000 mm or less.' },
        ],
      },
      {
        name: 'quantity',
        kind: 'number',
        label: 'Number of units',
        placeholder: '1',
        rules: [
          { type: 'required', message: 'Tell us roughly how many units you need.' },
          { type: 'min', value: 1, message: 'Enter at least 1 unit.' },
          { type: 'max', value: 200, message: 'Enter 200 units or less — call us for larger runs.' },
        ],
      },
      {
        name: 'construction',
        kind: 'radio',
        label: 'Construction',
        groupLabel: 'Construction',
        options: [
          { value: 'solid', label: 'Solid timber' },
          { value: 'veneered', label: 'Veneered' },
          { value: 'engineered', label: 'Engineered or sheet goods' },
          { value: 'unsure', label: 'Advise me' },
        ],
        rules: [
          { type: 'required', message: 'Choose a construction, or choose "Advise me".' },
        ],
      },
      {
        name: 'features',
        kind: 'checkbox-group',
        label: 'Features you would like to include',
        groupLabel: 'Features you would like to include',
        hint: 'Select any that apply.',
        options: [
          { value: 'handles', label: 'Hand-cut or brass handles' },
          { value: 'lighting', label: 'Integrated lighting' },
          { value: 'appliances', label: 'Appliance housing' },
          { value: 'hidden-storage', label: 'Concealed storage' },
          { value: 'curved', label: 'Curved or shaped elements' },
          { value: 'bespoke', label: 'Something else entirely' },
        ],
        rules: [
          {
            type: 'minSelected',
            value: 1,
            message: 'Select at least one feature so we know where to focus the detail.',
          },
        ],
        wide: true,
      },
    ],
  },
  {
    id: 'review',
    name: 'Review',
    caption: 'Check and send',
    title: 'Review your request',
    intro:
      'Check the summary below. You can go back to any step to correct an answer before sending.',
    fields: [
      {
        name: 'consent',
        kind: 'checkbox',
        label:
          'I understand this is an enquiry rather than a booking, and that the studio will confirm the specification and price before any work is scheduled.',
        rules: [
          { type: 'required', message: 'Confirm the acknowledgement before sending your request.' },
        ],
        wide: true,
      },
    ],
  },
];

/** The index of the step whose contents are edited. */
export const EDITABLE_STEP_COUNT = STEPS.length;

/** The final step, which holds the summary and the consent gate. */
export const REVIEW_STEP_ID = 'review';

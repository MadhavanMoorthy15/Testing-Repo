# Spec Delta

## Purpose
Defines the behavior of the multi-step commission request form: how its steps are defined and ordered, how each field is rendered and validated, and how the user moves between steps.

## ADDED Requirements

### Requirement: Step model
The application SHALL present the commission request as an ordered sequence of steps — Client, Project, Specifications, and Review — and SHALL identify exactly one step as the current step at any moment.

#### Scenario: Application starts on the first step
- **WHEN** the user opens the commission request form
- **THEN** the Client step is the current step and its fields are displayed

#### Scenario: The step sequence is fixed
- **WHEN** the application renders the step indicator
- **THEN** the four steps appear in the order Client, Project, Specifications, Review

### Requirement: Schema-driven fields
Each step SHALL render its fields from a declarative description, and every field SHALL specify its label, control type, and validation rules in that description.

#### Scenario: Field types are rendered from the description
- **WHEN** a step contains a field described as a select with a list of options
- **THEN** the application renders a labelled select control containing exactly those options

#### Scenario: Labels are programmatically associated
- **WHEN** any field is rendered
- **THEN** its label is associated with its control so a screen reader announces the field name

### Requirement: Per-step validation
The application SHALL validate the fields of the current step before the user advances, and SHALL refuse to advance while any field in that step is invalid.

#### Scenario: Advancing with an invalid field
- **GIVEN** the current step contains a required field that has been left empty
- **WHEN** the user attempts to continue to the next step
- **THEN** the application stays on the current step and displays an error for the empty field

#### Scenario: Advancing with a valid field
- **GIVEN** every field in the current step is valid
- **WHEN** the user attempts to continue to the next step
- **THEN** the application advances to the next step

#### Scenario: Only the current step is validated
- **GIVEN** a later step contains an invalid field
- **WHEN** the user advances from the current step
- **THEN** the application advances without reporting an error from the later step

### Requirement: Inline error messaging
The application SHALL display a validation message adjacent to the field that failed, and SHALL mark that field as invalid for assistive technology.

#### Scenario: Error is shown next to the field
- **WHEN** a field fails validation
- **THEN** a message describing the problem is displayed immediately after that field's control

#### Scenario: Invalid field is announced
- **WHEN** a field fails validation
- **THEN** the field's control is marked as invalid and its error message is associated with it

#### Scenario: Error clears when the value becomes valid
- **WHEN** the user corrects a field that was showing an error
- **THEN** the error message for that field is no longer displayed

### Requirement: Error summary and focus management
When a step cannot be advanced, the application SHALL present a summary of that step's errors and SHALL move focus to the first invalid field.

#### Scenario: Summary lists every error on the step
- **GIVEN** two fields on the current step are invalid
- **WHEN** the user attempts to continue to the next step
- **THEN** a summary lists both errors and each entry links to the corresponding field

#### Scenario: Focus moves to the first invalid field
- **WHEN** the user attempts to continue to the next step and the step has errors
- **THEN** focus is placed on the first invalid field in document order

### Requirement: Progress indicator
The application SHALL display a progress indicator that reflects the current step and the completion state of the other steps.

#### Scenario: Current step is marked
- **WHEN** the application is on the Specifications step
- **THEN** the indicator marks Specifications as the current step and shows the preceding steps as complete

### Requirement: Field validation rules
The application SHALL support the following validation rules on fields: required, minimum length, maximum length, email format, URL format, numeric range, selection of at least one option for checkbox groups, and required selection of exactly one option for radio groups.

#### Scenario: Invalid email is rejected
- **WHEN** a field with an email rule contains a value that is not a valid email address
- **THEN** the field is invalid and the message states that a valid email address is required

#### Scenario: Value below the minimum length is rejected
- **WHEN** a field with a minimum length of 3 contains the value "ab"
- **THEN** the field is invalid and the message states the minimum length

#### Scenario: Value outside the numeric range is rejected
- **WHEN** a number field with a range of 10 to 100 contains the value 250
- **THEN** the field is invalid and the message states the allowed range

#### Scenario: Checkbox group requires at least one selection
- **WHEN** a required checkbox group has no selected options
- **THEN** the group is invalid and the message states that at least one option must be selected

#### Scenario: Radio group requires a selection
- **WHEN** a required radio group has no selected option
- **THEN** the group is invalid and the message states that a selection is required

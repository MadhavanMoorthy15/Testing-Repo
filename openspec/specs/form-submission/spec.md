# form-submission Specification

## Purpose
Defines the closing stage of the commission request: the summary of every answer, the requirement for explicit consent, the submission action, and the confirmation returned to the user.

## Requirements

### Requirement: Review summary
The application SHALL present a summary of every answer given across all steps before the request is submitted.

#### Scenario: Summary lists all answered fields
- **GIVEN** the user has completed the Client, Project, and Specifications steps
- **WHEN** the user reaches the Review step
- **THEN** the summary lists every answer grouped by the step it belongs to, using the field's label as the key

#### Scenario: Summary marks unanswered fields
- **GIVEN** an optional field was left empty
- **WHEN** the review summary is displayed
- **THEN** that field is shown with an explicit "not provided" marker rather than being omitted

### Requirement: Correction from review
The application SHALL allow the user to return from the Review step to any earlier step to change an answer, and SHALL preserve the answers already given.

#### Scenario: Returning to an earlier step
- **WHEN** the user selects an earlier step from the review summary
- **THEN** the application moves to that step and the answers given so far remain filled in

#### Scenario: Corrected answer appears in the summary
- **GIVEN** the user returned to an earlier step and changed an answer
- **WHEN** the user returns to the Review step
- **THEN** the summary shows the corrected value

### Requirement: Consent gate
The application SHALL require an explicit consent checkbox before the request can be submitted, and SHALL report the missing consent if the user attempts to submit without it.

#### Scenario: Submission without consent is blocked
- **GIVEN** the consent checkbox has not been checked
- **WHEN** the user attempts to submit the request
- **THEN** the application does not submit and displays an error stating that consent is required

#### Scenario: Consent satisfies the requirement
- **GIVEN** the consent checkbox has been checked
- **WHEN** the user attempts to submit the request
- **THEN** the application proceeds to submission

### Requirement: Submission
The application SHALL submit the request with all answers when consent is given and all steps are valid, and SHALL report failure without losing the user's answers.

#### Scenario: Successful submission
- **GIVEN** all steps are valid and consent has been given
- **WHEN** the user submits the request
- **THEN** the application shows a confirmation and no longer shows the editable form

#### Scenario: Submission preserves answers on failure
- **GIVEN** the user submits and the submission does not succeed
- **THEN** the application reports the failure and the user's answers remain present in the form

### Requirement: Confirmation reference
A successful submission SHALL produce a confirmation that includes a reference identifier for the request.

#### Scenario: Confirmation shows a reference
- **WHEN** the submission succeeds
- **THEN** the confirmation displays a reference identifier that can be used to refer to the request

### Requirement: Return to a new request
After a successful submission, the application SHALL offer to start a new request, and doing so SHALL clear the previous answers and the saved draft.

#### Scenario: Starting a new request
- **WHEN** the user chooses to start a new request after a successful submission
- **THEN** the application returns to the first step with empty answers and the saved draft is removed

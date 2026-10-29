# Spec Delta

## Purpose
Defines how an in-progress commission request survives interruption: how the answer state is autosaved, how it is restored when the user returns, and how it is discarded on request.

## ADDED Requirements

### Requirement: Autosave of in-progress answers
The application SHALL persist the current answers and the current step to local storage as the user makes changes, without requiring an explicit save action.

#### Scenario: Answers are persisted after a change
- **WHEN** the user changes the value of a field
- **THEN** the updated answers and the current step are written to local storage

#### Scenario: Only the current step and answers are persisted
- **WHEN** the application autosaves
- **THEN** the persisted payload contains the answers and the current step and contains no other user data

### Requirement: Draft restoration
The application SHALL restore a saved draft when the user returns to the form, and SHALL offer to continue from the restored draft rather than silently discarding it.

#### Scenario: Restoring a saved draft
- **GIVEN** a draft was saved with answers on the Project step
- **WHEN** the user returns to the form
- **THEN** the application restores the saved answers and the Project step, and shows that a saved draft was found

#### Scenario: Starting fresh when no draft exists
- **GIVEN** no draft has been saved
- **WHEN** the user opens the form
- **THEN** the application starts on the first step with empty answers and shows no draft prompt

#### Scenario: A corrupted draft does not block the form
- **GIVEN** the stored draft cannot be parsed
- **WHEN** the user opens the form
- **THEN** the application discards the stored draft, starts on the first step with empty answers, and shows no error

### Requirement: Draft clearing
The application SHALL let the user discard a saved draft, and SHALL remove the persisted data and reset the form to its initial state.

#### Scenario: Discarding a draft
- **GIVEN** a draft has been saved
- **WHEN** the user confirms discarding the draft
- **THEN** the persisted draft is removed, the form returns to the first step with empty answers, and the restored answers are no longer displayed

#### Scenario: Cancelling the discard keeps the draft
- **GIVEN** a draft has been saved
- **WHEN** the user declines the confirmation to discard it
- **THEN** the persisted draft is retained and the answers remain displayed

### Requirement: Draft isolation
The application SHALL store its draft under a single dedicated key so it can be located and removed deterministically.

#### Scenario: Draft key is stable
- **WHEN** the application saves a draft
- **THEN** it is written under a single known key that identifies the commission request form

#### Scenario: Draft key can be removed independently
- **WHEN** the application clears the draft
- **THEN** only the draft key is removed and no other stored application data is affected

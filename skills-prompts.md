# Skills Invocation Prompts

This document provides the actual prompts to invoke each skill in both repositories.

---

## VS Code Private Repository (`.github/skills/`)

### 1. accessibility
**Path:** `.github/skills/accessibility/SKILL.md`
```
Prompt: "I need to add accessibility support to a new button component in the workbench. Please audit the implementation for ARIA labels, keyboard navigation, and focus indicators."
```

### 2. add-policy
**Path:** `.github/skills/add-policy/SKILL.md`
```
Prompt: "I want to add a new configuration policy 'feature.enablePreview' to VS Code. Please guide me through the full policy lifecycle from registration to export."
```

### 3. agent-sessions-layout
**Path:** `.github/skills/agent-sessions-layout/SKILL.md`
```
Prompt: "I need to modify the agents workbench layout to add a new panel in the sidebar footer. Please review the layout implementation requirements."
```

### 4. author-contributions
**Path:** `.github/skills/author-contributions/SKILL.md`
```
Prompt: "Who contributed what code on branch 'feature/new-editor' compared to main? I need to trace the changes made by 'johndoe'."
```

### 5. auto-perf-optimize
**Path:** `.github/skills/auto-perf-optimize/SKILL.md`
```
Prompt: "Launch Code OSS and automate a scenario where I open 10 files simultaneously. I need to capture CPU and memory metrics to profile performance."
```

### 6. azure-pipelines
**Path:** `.github/skills/azure-pipelines/SKILL.md`
```
Prompt: "I modified the build.yml in the azure-pipelines directory. Please validate the changes and queue a test build to iterate without waiting for full CI."
```

### 7. chat-customizations-editor
**Path:** `.github/skills/chat-customizations-editor/SKILL.md`
```
Prompt: "I want to add a new agent instruction in the Chat Customizations editor. Please guide me through the implementation."
```

### 8. chat-perf
**Path:** `.github/skills/chat-perf/SKILL.md`
```
Prompt: "Run chat performance benchmarks against the local dev build. I need to check for memory leaks in the chat response pipeline with 100 messages."
```

### 9. component-fixtures
**Path:** `.github/skills/component-fixtures/SKILL.md`
```
Prompt: "I created a new progress bar component in the workbench. Please help me create a screenshot fixture for it."
```

### 10. cpu-profile-analysis
**Path:** `.github/skills/cpu-profile-analysis/SKILL.md`
```
Prompt: "I have a .cpuprofile file from a slow file indexing operation. Please analyze it and identify the main bottlenecks."
```

### 11. fix-ci-failures
**Path:** `.github/skills/fix-ci-failures/SKILL.md`
```
Prompt: "CI checks are failing on PR #42. Please investigate the failed checks, download the logs, and identify the root cause."
```

### 12. fix-errors
**Path:** `.github/skills/fix-errors/SKILL.md`
```
Prompt: "I'm seeing an unhandled error in telemetry: 'Cannot read properties of undefined (reading 'focus')'. Stack trace shows it originated in editor.ts. Please trace the data flow and fix it."
```

### 13. heap-snapshot-analysis
**Path:** `.github/skills/heap-snapshot-analysis/SKILL.md`
```
Prompt: "Objects are not being garbage collected after closing an editor. I captured before.heapsnapshot and after.heapsnapshot. Please analyze and find what's retaining them."
```

### 14. hygiene
**Path:** `.github/skills/hygiene/SKILL.md`
```
Prompt: "I made changes to three files in src/vs/workbench/. Please run the pre-commit hygiene check to verify copyright headers, indentation, and formatting."
```

### 15. integration-tests
**Path:** `.github/skills/integration-tests/SKILL.md`
```
Prompt: "I wrote an integration test for the new editor feature. Please run the integration tests using scripts/test-integration.sh with filter on 'editor'."
```

### 16. launch
**Path:** `.agents/skills/launch/SKILL.md`
```
Prompt: "Launch Code OSS and take a screenshot of the welcome page. Then click on 'Get Started' and capture that screen."
```

### 17. memory-leak-audit
**Path:** `.github/skills/memory-leak-audit/SKILL.md`
```
Prompt: "Please audit the SearchView component in workbench/contrib/search/ for potential memory leaks. It registers event listeners and uses disposables."
```

### 18. otel
**Path:** `.github/skills/otel/SKILL.md`
```
Prompt: "I need to add OpenTelemetry instrumentation to a new agent surface. Please guide me through adding spans, metrics, and events following the conventions."
```

### 19. sessions
**Path:** `.github/skills/sessions/SKILL.md`
```
Prompt: "I want to implement a new feature in the Agents window that shows a history panel. Please review the architecture and guide me through implementation."
```

### 20. tool-rename-deprecation
**Path:** `.github/skills/tool-rename-deprecation/SKILL.md`
```
Prompt: "I renamed toolReferenceName from 'vscode.chat.request' to 'vscode.chat.ask'. Please ensure backward compatibility is preserved with legacyToolReferenceFullNames."
```

### 21. unit-tests
**Path:** `.github/skills/unit-tests/SKILL.md`
```
Prompt: "Please run unit tests for src/vs/base/common/strings.ts using scripts/test.sh with --grep 'format' to filter tests."
```

### 22. update-screenshots
**Path:** `.github/skills/update-screenshots/SKILL.md`
```
Prompt: "The screenshot-test GitHub Action on the latest CI run reported differences for the Button component. Please download the new baselines and commit them."
```

### 23. vscode-dev-workbench
**Path:** `.github/skills/vscode-dev-workbench/SKILL.md`
```
Prompt: "Please start the vscode.dev server locally against the microsoft/vscode sources. I want to interact with the workbench in the browser using vscode-quality=dev."
```

---

## Testing-Repo (`.codestudio/skills/`)

### 24. frontend-design
**Path:** `.codestudio/skills/frontend-design/SKILL.md`
```
Prompt: "Create a modern, production-ready login page for an e-commerce app. It should include email/password fields, a social login button, and a 'forgot password' link. Follow mobile-first responsive design."
```

### 25. openspec-apply-change
**Path:** `.codestudio/skills/openspec-apply-change/SKILL.md`
```
Prompt: "I have a change proposal in openspec/changes/product-reviews/ with pending tasks. Please help me implement them following the spec."
```

### 26. openspec-archive-change
**Path:** `.codestudio/skills/openspec-archive-change/SKILL.md`
```
Prompt: "The voice-recorder feature implementation is complete and verified. Please archive the change in openspec/changes/archive/."
```

### 27. openspec-bulk-archive-change
**Path:** `.codestudio/skills/openspec-bulk-archive-change/SKILL.md`
```
Prompt: "Three changes are complete: auth-flow, onboarding, and home-dashboard. Please archive all three at once."
```

### 28. openspec-explore
**Path:** `.codestudio/skills/openspec-explore/SKILL.md`
```
Prompt: "I'm trying to implement a real-time collaboration feature but I'm unclear on the conflict resolution strategy. Can we explore this problem together?"
```

### 29. openspec-propose
**Path:** `.codestudio/skills/openspec-propose/SKILL.md`
```
Prompt: "I want to add a dark mode feature to the e-commerce app with system preference detection and manual toggle. Please create a complete change proposal with design, specs, and tasks."
```

### 30. openspec-verify-change
**Path:** `.codestudio/skills/openspec-verify-change/SKILL.md`
```
Prompt: "I've completed implementing the shopping-cart feature. Please verify the implementation matches all the specs and that all Given/When/Then scenarios pass."
```

### 31. style-checker
**Path:** `.codestudio/skills/style-checker/SKILL.md`
```
Prompt: "Please review PR #15 for style compliance. Check that the CSS follows the design system standards and uses the correct color palette."
```

---

## Quick Reference: Skill Category Prompts

### Performance Testing
```
auto-perf-optimize:  "Profile VS Code opening 10 files simultaneously"
chat-perf:           "Run chat benchmarks with 100 messages"
cpu-profile-analysis: "Analyze this .cpuprofile for bottlenecks"
heap-snapshot-analysis: "Find what's retaining objects after closing editors"
memory-leak-audit:   "Audit SearchView for disposable issues"
```

### Testing & CI
```
fix-ci-failures:     "Investigate failing CI on PR #42"
integration-tests:   "Run integration tests for editor feature"
unit-tests:          "Run tests for strings.ts with --grep 'format'"
update-screenshots:  "Update baselines from latest CI screenshot diff"
hygiene:             "Check my changes for copyright headers and formatting"
```

### Code Analysis
```
author-contributions: "Trace 'johndoe's changes on feature branch"
fix-errors:          "Debug this error: Cannot read 'focus' of undefined"
code-intelligence:    "Find all usages of 'createEditor' across repos"
```

### UI & Design
```
accessibility:       "Audit new button for ARIA and keyboard nav"
component-fixtures:   "Create screenshot fixture for progress bar"
frontend-design:      "Create a modern login page"
style-checker:        "Review PR #15 CSS for design compliance"
```

### Architecture
```
agent-sessions-layout: "Add new panel to agents workbench"
sessions:              "Implement history panel in Agents window"
otel:                  "Add telemetry to new agent surface"
add-policy:            "Add feature.enablePreview policy"
tool-rename-deprecation: "Ensure backward compat after tool rename"
```

### Development Workflow
```
launch:                "Take screenshot of VS Code welcome page"
azure-pipelines:      "Validate build.yml and queue test build"
vscode-dev-workbench: "Start vscode.dev server against local sources"
```

### OpenSpec Workflow
```
openspec-explore:     "Help me think through conflict resolution"
openspec-propose:     "Propose dark mode feature with full spec"
openspec-apply-change: "Implement tasks from product-reviews change"
openspec-verify-change: "Verify shopping-cart implementation"
openspec-archive-change: "Archive completed voice-recorder change"
openspec-bulk-archive-change: "Archive three completed changes"
```

---

## Template: Custom Skill Invocation

```
I need to use the [SKILL_NAME] skill for [BRIEF_DESCRIPTION].

Context:
- [What you're working on]
- [What you've tried so far]
- [Any specific constraints or requirements]

Please read the skill file and guide me through the process.
```
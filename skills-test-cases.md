# Skills Test Cases

This document provides test cases for invoking skills in both vscode-private and Testing-Repo.

---

## VS Code Private Repository (`.github/skills/`)

### 1. Accessibility Skill
**Path:** `.github/skills/accessibility/SKILL.md`
```
Test Case: Verify a new UI component meets accessibility standards
1. Create a new button component in the workbench
2. Invoke accessibility skill to audit the component
3. Verify ARIA labels, keyboard navigation, and focus indicators
```

### 2. Add-Policy Skill
**Path:** `.github/skills/add-policy/SKILL.md`
```
Test Case: Add a new configuration policy to VS Code
1. Define a new policy field in an existing configuration
2. Invoke add-policy skill to register the policy
3. Verify policy is exported to platform-specific artifacts
```

### 3. Agent-Sessions-Layout Skill
**Path:** `.github/skills/agent-sessions-layout/SKILL.md`
```
Test Case: Modify the agents workbench layout
1. Change grid configuration for a specific part
2. Invoke agent-sessions-layout skill
3. Verify layout changes render correctly
```

### 4. Author-Contributions Skill
**Path:** `.github/skills/author-contributions/SKILL.md`
```
Test Case: Trace code contributions by a specific author
1. Identify an author and branch to analyze
2. Invoke author-contributions skill
3. Verify output shows all files modified by that author
```

### 5. Auto-Perf-Optimize Skill
**Path:** `.github/skills/auto-perf-optimize/SKILL.md`
```
Test Case: Profile a VS Code scenario for performance
1. Launch Code OSS with automated scenario
2. Invoke auto-perf-optimize skill
3. Verify CPU/memory metrics are captured correctly
```

### 6. Azure-Pipelines Skill
**Path:** `.github/skills/azure-pipelines/SKILL.md`
```
Test Case: Validate and iterate on pipeline YAML changes
1. Modify build.yml in azure-pipelines directory
2. Invoke azure-pipelines skill to queue a test build
3. Verify build status and iterate on failures
```

### 7. Chat-Customizations-Editor Skill
**Path:** `.github/skills/chat-customizations-editor/SKILL.md`
```
Test Case: Modify agent configuration in Chat Customizations
1. Edit agent instructions or hooks
2. Invoke chat-customizations-editor skill
3. Verify UI updates in the customizations editor
```

### 8. Chat-Perf Skill
**Path:** `.github/skills/chat-perf/SKILL.md`
```
Test Case: Benchmark chat rendering performance
1. Load chat panel with sample conversations
2. Invoke chat-perf skill to run benchmarks
3. Verify memory leak checks pass
```

### 9. Component-Fixtures Skill
**Path:** `.github/skills/component-fixtures/SKILL.md`
```
Test Case: Create a screenshot fixture for a new component
1. Build a new UI component
2. Invoke component-fixtures skill to create fixture
3. Verify fixture file is generated and themed correctly
```

### 10. CPU-Profile-Analysis Skill
**Path:** `.github/skills/cpu-profile-analysis/SKILL.md`
```
Test Case: Analyze a performance profile
1. Generate a .cpuprofile from a slow operation
2. Invoke cpu-profile-analysis skill
3. Verify bottleneck functions are identified
```

### 11. Fix-CI-Failures Skill
**Path:** `.github/skills/fix-ci-failures/SKILL.md`
```
Test Case: Investigate and fix a failing CI check
1. Identify a failing check on a PR
2. Invoke fix-ci-failures skill
3. Download logs and extract failure cause
4. Iterate on fix without full CI run
```

### 12. Fix-Errors Skill
**Path:** `.github/skills/fix-errors/SKILL.md`
```
Test Case: Debug an unhandled error from telemetry
1. Provide error stack trace from dashboard
2. Invoke fix-errors skill
3. Trace data flow and identify root cause
```

### 13. Frontend-Design Skill (Testing-Repo)
**Path:** `.codestudio/skills/frontend-design/SKILL.md`
```
Test Case: Create a new frontend component
1. Describe the UI requirements
2. Invoke frontend-design skill
3. Verify production-ready code is generated
```

### 14. Heap-Snapshot-Analysis Skill
**Path:** `.github/skills/heap-snapshot-analysis/SKILL.md`
```
Test Case: Investigate a memory leak
1. Capture heap snapshot before/after operation
2. Invoke heap-snapshot-analysis skill
3. Identify objects that should have been garbage collected
```

### 15. Hygiene Skill
**Path:** `.github/skills/hygiene/SKILL.md`
```
Test Case: Validate code changes pass hygiene checks
1. Make code modifications
2. Run pre-commit hook via hygiene skill
3. Verify copyright headers, indentation, and formatting pass
```

### 16. Integration-Tests Skill
**Path:** `.github/skills/integration-tests/SKILL.md`
```
Test Case: Run integration tests for a feature
1. Write an integration test for a workbench feature
2. Invoke integration-tests skill
3. Verify tests pass in CI environment
```

### 17. Launch Skill
**Path:** `.agents/skills/launch/SKILL.md`
```
Test Case: Launch VS Code via Playwright and automate UI
1. Start VS Code dev server
2. Invoke launch skill with @playwright/cli
3. Verify browser automation works correctly
```

### 18. Memory-Leak-Audit Skill
**Path:** `.github/skills/memory-leak-audit/SKILL.md`
```
Test Case: Audit code for disposable issues
1. Review a component that registers event listeners
2. Invoke memory-leak-audit skill
3. Verify disposables are properly managed
```

### 19. OpenSpec Skills (Testing-Repo)
**Paths:** `.codestudio/skills/openspec-*`

#### apply-change
```
Test Case: Implement tasks from an OpenSpec change
1. Review a change proposal with pending tasks
2. Invoke openspec-apply-change skill
3. Work through tasks sequentially
4. Verify implementation matches spec
```

#### archive-change
```
Test Case: Archive a completed change
1. Complete all tasks in a change proposal
2. Invoke openspec-archive-change skill
3. Verify change is moved to archive directory
```

#### explore
```
Test Case: Explore a problem before implementation
1. Define a complex problem to investigate
2. Invoke openspec-explore skill
3. Use as a thinking partner to clarify requirements
```

#### propose
```
Test Case: Propose a new change with artifacts
1. Describe what you want to build
2. Invoke openspec-propose skill
3. Verify complete proposal with design, specs, and tasks generated
```

#### verify-change
```
Test Case: Verify implementation matches change artifacts
1. Complete implementation of a change
2. Invoke openspec-verify-change skill
3. Verify all Given/When/Then scenarios pass
```

### 20. OTel Skill
**Path:** `.github/skills/otel/SKILL.md`
```
Test Case: Add instrumentation to a new agent surface
1. Define new spans/metrics for an agent
2. Invoke otel skill to instrument code
3. Verify spans appear in monitoring dashboards
```

### 21. Sessions Skill
**Path:** `.github/skills/sessions/SKILL.md`
```
Test Case: Implement a feature in the Agents window
1. Design a new feature for the agents window
2. Invoke sessions skill
3. Verify feature follows architecture patterns
```

### 22. Style-Checker Skill (Testing-Repo)
**Path:** `.codestudio/skills/style-checker/SKILL.md`
```
Test Case: Review PR for style compliance
1. Create a PR with code changes
2. Invoke style-checker skill
3. Verify CSS/styling follows design system standards
```

### 23. Tool-Rename-Deprecation Skill
**Path:** `.github/skills/tool-rename-deprecation/SKILL.md`
```
Test Case: Rename a built-in tool reference
1. Rename a toolReferenceName in registration code
2. Invoke tool-rename-deprecation skill
3. Verify legacyToolReferenceFullNames preserves backward compatibility
```

### 24. Unit-Tests Skill
**Path:** `.github/skills/unit-tests/SKILL.md`
```
Test Case: Run unit tests for a module
1. Write unit tests for a base utility function
2. Invoke unit-tests skill to run tests
3. Verify tests pass with --grep filter
```

### 25. Update-Screenshots Skill
**Path:** `.github/skills/update-screenshots/SKILL.md`
```
Test Case: Update screenshot baselines from CI
1. Review screenshot test report from CI
2. Invoke update-screenshots skill
3. Download and commit new baselines
```

### 26. VSCode-Dev-Workbench Skill
**Path:** `.github/skills/vscode-dev-workbench/SKILL.md`
```
Test Case: Run vscode.dev against local sources
1. Start the dev server
2. Invoke vscode-dev-workbench skill
3. Interact with workbench via browser
```

---

## Summary Table

| # | Skill | Repo | Test Complexity |
|---|-------|------|-----------------|
| 1 | accessibility | vscode-private | Medium |
| 2 | add-policy | vscode-private | Medium |
| 3 | agent-sessions-layout | vscode-private | High |
| 4 | author-contributions | vscode-private | Low |
| 5 | auto-perf-optimize | vscode-private | High |
| 6 | azure-pipelines | vscode-private | Medium |
| 7 | chat-customizations-editor | vscode-private | Medium |
| 8 | chat-perf | vscode-private | High |
| 9 | component-fixtures | vscode-private | Medium |
| 10 | cpu-profile-analysis | vscode-private | High |
| 11 | fix-ci-failures | vscode-private | Medium |
| 12 | fix-errors | vscode-private | High |
| 13 | frontend-design | Testing-Repo | Medium |
| 14 | heap-snapshot-analysis | vscode-private | High |
| 15 | hygiene | vscode-private | Low |
| 16 | integration-tests | vscode-private | Medium |
| 17 | launch | vscode-private | High |
| 18 | memory-leak-audit | vscode-private | Medium |
| 19 | openspec-apply-change | Testing-Repo | High |
| 20 | openspec-archive-change | Testing-Repo | Low |
| 21 | openspec-explore | Testing-Repo | Low |
| 22 | openspec-propose | Testing-Repo | Medium |
| 23 | openspec-verify-change | Testing-Repo | High |
| 24 | otel | vscode-private | High |
| 25 | sessions | vscode-private | High |
| 26 | style-checker | Testing-Repo | Low |
| 27 | tool-rename-deprecation | vscode-private | Medium |
| 28 | unit-tests | vscode-private | Low |
| 29 | update-screenshots | vscode-private | Medium |
| 30 | vscode-dev-workbench | vscode-private | High |

---

## Recommended Test Order

1. **Low Complexity First** (quick wins):
   - author-contributions
   - hygiene
   - unit-tests
   - openspec-archive-change
   - openspec-explore
   - style-checker

2. **Medium Complexity** (standard workflows):
   - accessibility, add-policy, azure-pipelines
   - component-fixtures, integration-tests, unit-tests
   - fix-ci-failures, update-screenshots

3. **High Complexity** (full-stack scenarios):
   - auto-perf-optimize, chat-perf
   - cpu-profile-analysis, heap-snapshot-analysis
   - openspec-apply-change, openspec-verify-change
   - launch, vscode-dev-workbench, sessions
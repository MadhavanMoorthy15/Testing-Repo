---
name: yaml-missing-description
  some-indent: value
---

# No description at all

The header holds a `name` and one other key, and no `description` key anywhere.

## Why this skill does not load

The loader needs a name and a description. It skips the skill and reports:

```
Skipping <path>/SKILL.md: missing required 'name' or 'description'
```

The lenient scan finds no `description` key either, so the skill cannot be recovered.

## How to repair the header

Add a `description` key at the same column as the other keys:

```yaml
---
name: yaml-missing-description
description: Reproduces a header with no description, which the loader cannot recover from.
some-indent: value
---
```

---
name: yaml-empty-fields
description:
license: MIT
---

# Empty description

The `description` key holds no value. Nothing in the header gives the skill a description.

## Why this skill does not load

The loader needs a name and a description. When the description is empty it skips the skill
and reports:

```
Skipping <path>/SKILL.md: missing required 'name' or 'description'
```

The lenient scan does not help here. It also reads an empty value as empty, so the skill
cannot be recovered.

## How to repair the header

Give the key a value:

```yaml
---
name: yaml-empty-fields
description: Reproduces an empty description, which the loader cannot recover from.
license: MIT
---
```

---
name: yaml-name-mismatch-typo
description: Reproduces a name that does not match the folder the skill lives in.
---

# Name does not match the folder

The header names the skill `yaml-name-mismatch-typo`, but the skill folder is
`yaml-name-mismatch`.

## Why the skill still loads

The loader reads the name from the header and does not compare it with the folder name.
The skill loads and appears in the skills list under the name in the header.

## What the loader reports

The name check is a warning, not a rejection:

```
Skill 'yaml-name-mismatch-typo' in <path>/SKILL.md does not follow Agent Skills
specification: name 'yaml-name-mismatch-typo' must match directory name
'yaml-name-mismatch'. Consider renaming for spec compliance.
```

## How to repair the header

Make the name match the folder name exactly. The Agent Skills specification asks for
lowercase letters, digits and single hyphens, and the name must equal the folder name.

```yaml
---
name: yaml-name-mismatch
description: Reproduces a name that does not match the folder the skill lives in.
---
```

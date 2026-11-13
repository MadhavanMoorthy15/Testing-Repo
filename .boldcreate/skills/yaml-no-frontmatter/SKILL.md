# No frontmatter header

The file starts with its body text. There is no `---` header, so there is no name and no
description to read.

## Why this skill does not load

The loader matches the `---` header first. Without one it skips the skill and reports:

```
Skipping <path>/SKILL.md: no valid YAML frontmatter found
```

This case is different from the broken-YAML cases. A malformed header can be recovered
because the loader still finds `name` and `description` inside it. A missing header holds
neither.

## How to repair the file

Add a header with a name and a description:

```yaml
---
name: yaml-no-frontmatter
description: Reproduces a skill file with no frontmatter header at all.
---
```

---
name: yaml-nested-compact-mapping
description: Reproduces the "nested mappings are not allowed in compact mappings" YAML error, where an indented line follows a compact key.
  allowed-tools: read_file
---

# Nested mappings in compact mappings

The `description` key above holds a value on the same line. The next line is indented, so a
strict YAML parser reads it as a nested mapping under `description` and rejects the whole
header with:

```
Nested mappings are not allowed in compact mappings at line 3, column 3
```

## Why the skill still loads

The loader falls back to a lenient scan when the strict parser rejects the header. The scan
reads `key: value` pairs line by line and keeps the last value of each key. It recovers
`name` and `description` and drops the rest of the header, so the skill reaches the agent
with a usable name and description.

## How to repair the header

Put the nested keys on their own lines at the same column as the other keys:

```yaml
---
name: yaml-nested-compact-mapping
description: Reproduces the "nested mappings are not allowed in compact mappings" YAML error, where an indented line follows a compact key.
allowed-tools: read_file
---
```

Note that the repair loses `allowed-tools`, because the lenient scan only recovers `name` and
`description`.

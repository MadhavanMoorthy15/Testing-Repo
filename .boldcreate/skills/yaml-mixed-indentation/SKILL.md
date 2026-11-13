---
name: yaml-mixed-indentation
  description: Reproduces the "all mapping items must start at the same column" YAML error.
license: MIT
  version: 1.0
---

# All mapping items must start at the same column

Two of the four keys are indented by two spaces and two are not. A strict YAML parser
requires every mapping item in a block to start at the same column and rejects the header
with:

```
All mapping items must start at the same column at line 5, column 3
```

## Why the skill still loads

The lenient scan ignores the indentation of every line. It reads each `key: value` pair,
so it recovers `name` and `description` from the header even though the header as a whole
is invalid.

## How to repair the header

Bring every key back to column 1:

```yaml
---
name: yaml-mixed-indentation
description: Reproduces the "all mapping items must start at the same column" YAML error.
license: MIT
version: 1.0
---
```

---
name: yaml-implicit-key-multiline
description: Reproduces the "implicit keys need to be on a single line" YAML error, where the value continues on the next line.
The continuation line has no indentation, so a strict parser reads it as a new implicit key.
---

# Implicit keys need to be on a single line

The `description` value runs over two lines. The second line starts at column 1, so a strict
YAML parser treats it as a second key without a value and rejects the header with:

```
Implicit keys need to be on a single line at line 4, column 3
```

## Why the skill still loads

The lenient scan treats a line that is not a `key: value` pair as a continuation of the
current value and joins it with a space. The recovered description therefore reads as one
sentence.

## How to repair the header

Keep the value on one line, or indent the continuation so it belongs to the key:

```yaml
---
name: yaml-implicit-key-multiline
description: >-
  Reproduces the "implicit keys need to be on a single line" YAML error, where the value
  continues on the next line.
---
```

The indented form parses strictly, so the skill keeps every other field it declares.

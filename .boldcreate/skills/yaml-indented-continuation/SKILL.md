---
name: yaml-indented-continuation
description:
  Reproduces a description written on its own indented line, which the strict parser reads as a nested mapping.
license: MIT
---

# Description on an indented line

The `description` key has no value of its own. The text sits on the next line, indented by
two spaces, so a strict YAML parser reads it as a nested mapping under `description` rather
than as the value of the key.

This form parses strictly, because YAML allows a block value under a key on its own line.
The recovered description is the indented text.

## Why this skill loads

Both parsers agree on the result. The strict parser succeeds, so the loader never falls
back to the lenient scan, and the skill keeps `license` as well as `description`.

## How to keep a multi-line description

Use the folded block form, which is the clearest way to write a long description:

```yaml
---
name: yaml-indented-continuation
description: >-
  Reproduces a description written on its own indented line, which the strict parser reads
  as a nested mapping.
license: MIT
---
```

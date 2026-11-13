---
name: yaml-quote-trailing-char
description: Reproduces the "unexpected scalar at node end" YAML error, where a closing quote is followed by a stray character.
generatedBy: "1.12.0"^
license: MIT
---

# Quote followed by a stray character

The `generatedBy` value is a quoted string with a caret after the closing quote. A strict
YAML parser reads the caret as an unexpected scalar at the end of the node and rejects the
header.

## Why the skill still loads

The lenient scan reads the value as the quoted text plus the stray character, then strips
the surrounding quotes. Because the stray character sits after the closing quote, the
stripped value keeps it. The skill's `name` and `description` are unaffected.

## How to repair the header

Remove the stray character, or move it inside the quotes:

```yaml
---
name: yaml-quote-trailing-char
description: Reproduces the "unexpected scalar at node end" YAML error, where a closing quote is followed by a stray character.
generatedBy: "1.12.0"
license: MIT
---
```

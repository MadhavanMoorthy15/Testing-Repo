---
name: yaml-unterminated-quote
description: "Reproduces the missing closing quote YAML error, where a quoted value never ends.
license: MIT
---

# Missing closing quote

The `description` value opens with a double quote and never closes it. A strict YAML parser
reports an unterminated quoted scalar and rejects the header.

## Why the skill still loads

The lenient scan treats the quoted text as a plain value and keeps the text up to the end of
the line. The recovered description is the quoted text without its opening quote.

## How to repair the header

Close the quote on the same line, or drop the quote and keep the value plain:

```yaml
---
name: yaml-unterminated-quote
description: "Reproduces the missing closing quote YAML error, where a quoted value never ends."
license: MIT
---
```

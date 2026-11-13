---
name: yaml-special-characters
description: Reproduces special characters: colons, "quotes", ampersands & slashes/path.
license: MIT/Apache
url: https://example.com/docs
---

# Special characters in values

The description holds a colon, double quotes, an ampersand and a slash. A plain YAML value
may hold a colon only when the colon is not followed by a space, and a value that starts
with a quote is read as a quoted scalar.

## Why the skill still loads

The strict parser rejects this header, so the loader falls back to the lenient scan. The
scan keeps the whole line as the value and the skill loads with the description intact.

## How to repair the header

Quote the whole value and escape the inner quotes. The strict parser then reads the value
exactly as written, and the skill keeps `license` as well.

```yaml
---
name: yaml-special-characters
description: "Reproduces special characters: colons, \"quotes\", ampersands & slashes/path."
license: MIT/Apache
url: https://example.com/docs
---
```

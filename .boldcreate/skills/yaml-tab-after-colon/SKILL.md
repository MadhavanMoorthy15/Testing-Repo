---
name: yaml-tab-after-colon
description:	Reproduces a tab placed after the colon of a key.
license: MIT
---

# Tab after the colon

The `description` value is separated from its key by a tab instead of a space. The YAML spec
allows a tab as the separator between a key and its value, so a strict parser accepts this
header and the skill keeps `license`.

## Why this skill loads

Both parsers agree. The strict parser succeeds, so the loader never falls back to the
lenient scan.

## How to keep the header portable

Use a single space after the colon. Editors and other YAML readers differ on how they treat
a tab there.

```yaml
---
name: yaml-tab-after-colon
description: Reproduces a tab placed after the colon of a key.
license: MIT
---
```

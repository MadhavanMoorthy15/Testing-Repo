---
name: yaml-tab-indentation
description:
	Reproduces a tab used as indentation, which the YAML spec forbids.
license: MIT
---

# Tab used as indentation

The `description` key has no value of its own. The text sits on the next line and starts
with a tab character. The YAML spec forbids a tab as indentation, so a strict parser rejects
the header.

## Why the skill still loads

The lenient scan trims every line before it reads the key and the value, so it ignores the
tab. The recovered description is the text after the tab.

## How to repair the header

Replace the tab with spaces:

```yaml
---
name: yaml-tab-indentation
description:
  Reproduces a tab used as indentation, which the YAML spec forbids.
license: MIT
---
```

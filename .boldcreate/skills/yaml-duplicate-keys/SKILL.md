---
name: yaml-duplicate-keys
description: First description value.
description: Second description value wins.
---

# Duplicate keys

The header declares `description` twice. A strict YAML parser rejects a duplicate key in a
mapping, because it cannot tell which value the author meant.

## Why the skill still loads

The lenient scan keeps the last value of each key it reads, so the recovered description is
the second one. The skill loads with the second value and the first one is lost.

## How to repair the header

Keep one `description` and give the other key its own name:

```yaml
---
name: yaml-duplicate-keys
description: Second description value wins.
summary: First description value.
---
```

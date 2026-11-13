---
name: yaml-valid-frontmatter
description: Shows a frontmatter header that every YAML parser accepts, with every field the loader reads.
license: MIT
compatibility: Node.js 22.13 or newer
allowed-tools: read_file write_file
metadata:
  author: codestudio
  version: 1.0
---

# Valid frontmatter

This header parses under a strict YAML parser, so the loader reads every field and the
skill keeps all of them.

## The fields the loader reads

| Field | Required | What it holds |
|---|---|---|
| `name` | yes | The skill name. Must equal the folder name. |
| `description` | yes | What the skill does and when to use it. |
| `license` | no | The license of the skill. |
| `compatibility` | no | What the skill needs to run. |
| `allowed-tools` | no | The tools the skill recommends. |
| `metadata` | no | Any other key and value pairs. |
| `module` | no | The entrypoint of a script the skill can run. |

## Rules the loader applies

- The `name` is 1 to 64 characters, holds lowercase letters, digits and single hyphens, and
  equals the folder name.
- The `description` is at most 1024 characters. A longer one is cut and reported.
- The `compatibility` is at most 500 characters. A longer one is cut and reported.
- `allowed-tools` takes either a list or a string of names separated by spaces.
- The file is at most 10 MB.

## A header that parses

```yaml
---
name: yaml-valid-frontmatter
description: Shows a frontmatter header that every YAML parser accepts.
license: MIT
compatibility: Node.js 22.13 or newer
allowed-tools: read_file write_file
metadata:
  author: codestudio
  version: 1.0
---
```

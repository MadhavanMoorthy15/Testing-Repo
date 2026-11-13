---
name: yaml-skill-frontmatter
description: Read and repair the YAML frontmatter of a SKILL.md file when the loader rejects it or drops the skill. Use when a skill does not appear in the skills list, when the log reports a YAML error, or when writing the frontmatter of a new skill.
license: MIT
---

# The frontmatter of a SKILL.md

A skill file starts with a YAML header between two `---` lines. The header holds the name
and the description, and it is what the loader reads.

```yaml
---
name: my-skill
description: What the skill does and when to use it.
---
```

## The rules the loader applies

| Rule | What happens when it is broken |
|---|---|
| The file starts with `---` | The skill is skipped: "no valid YAML frontmatter found" |
| The header holds a `name` | The skill is skipped: "missing required 'name' or 'description'" |
| The header holds a `description` | The skill is skipped: "missing required 'name' or 'description'" |
| The `name` equals the folder name | A warning, and the skill still loads |
| The `name` is lowercase, digits and single hyphens | A warning, and the skill still loads |
| The `description` is at most 1024 characters | It is cut, and the cut is reported |
| The file is at most 10 MB | The skill is skipped |

The name must equal the folder name. A skill in `my-skill/SKILL.md` needs
`name: my-skill`.

## The lenient parser

When the strict parser rejects the header, the loader reads it again with a lenient scan.
The scan reads `key: value` pairs line by line and keeps the last value of each key.

This means a broken header still loads, with two limits:

- Only `name` and `description` are recovered. Every other field is lost.
- The recovery is silent. Nothing is written to the log.

So a skill that loads with the wrong description is usually a skill whose header was
recovered leniently. Repair the header to get the full behaviour back.

## The errors and what they mean

| The parser says | What is in the file |
|---|---|
| Nested mappings are not allowed in compact mappings | An indented line follows a `key: value` line |
| Implicit keys need to be on a single line | The value continues on the next line, unindented |
| All mapping items must start at the same column | Some keys are indented and others are not |
| Unexpected scalar at node end | A quoted value has a character after its closing quote |
| A tab is not allowed as indentation | A line starts with a tab |

## Repairing a header

1. Bring every key to the same column.
2. Keep each value on one line, or indent the continuation so it belongs to the key.
3. Quote a value that holds a colon followed by a space, and escape the inner quotes.
4. Close every quote.
5. Replace a tab with spaces.

A header that repairs cleanly keeps every field. A header that only the lenient parser can
read loses everything except the name and the description.

## Writing a new skill

Write the header so that a strict parser accepts it. A description with a colon, a quote
or a line break is the usual cause of a broken header.

```yaml
---
name: my-skill
description: "What the skill does, with any colons, quotes and line breaks handled."
license: MIT
---
```

The longest safe form is the folded block, for a description that spans several lines:

```yaml
---
name: my-skill
description: >-
  What the skill does, written over several lines, folded into one.
---
```

## The fields

| Field | Required | What it holds |
|---|---|---|
| `name` | yes | The skill name, equal to the folder name |
| `description` | yes | What the skill does and when to use it |
| `license` | no | The license of the skill |
| `compatibility` | no | What the skill needs to run |
| `allowed-tools` | no | The tools the skill recommends |
| `metadata` | no | Any other key and value pairs |
| `module` | no | The entrypoint of a script the skill can run |

## The folder

A skill is a folder with a `SKILL.md` in it. The folder may hold more files beside it.

```
my-skill/
├── SKILL.md
├── reference.md
└── scripts/
    └── check.mjs
```

The skill's supporting files are read when the skill needs them, not all at once. Keep
`SKILL.md` short and move the long material into the other files.

## Related

- The `yaml-*` skills in this folder each hold one broken header and explain it.
- `yaml-valid-frontmatter` shows a header that every parser accepts.

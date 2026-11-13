# The YAML errors the loader reports

Each error below comes from a real file that reached the loader in production. The table
gives the message, the shape of the header that caused it, and what the loader does.

| The parser says | The header looks like | The loader |
|---|---|---|
| Nested mappings are not allowed in compact mappings | `description: y` then an indented `allowed-tools: read_file` | Recovers the name and the description |
| Implicit keys need to be on a single line | `description: Generate charts` then an unindented `for data visualization` | Recovers the name and the description, with the lines joined |
| All mapping items must start at the same column | `name:` at column 1 and `description:` at column 3 | Recovers the name and the description |
| Unexpected scalar at node end | `generatedBy: "1.12.0"^` | Recovers the name and the description |
| A tab is not allowed as indentation | `description:` then a line that starts with a tab | Recovers the name and the description |
| A duplicate key is not allowed | `description:` twice | Recovers the name and the description, with the last value |
| A quoted value is not closed | `description: "Generate charts` with no closing quote | Recovers the name and the description |

## The cases the loader cannot recover

| The case | What the loader reports |
|---|---|
| The file has no `---` header | "no valid YAML frontmatter found" |
| The header has no `name` | "missing required 'name' or 'description'" |
| The header has no `description` | "missing required 'name' or 'description'" |
| The `description` is empty | "missing required 'name' or 'description'" |

A header that holds a name and a description always recovers, whatever else is wrong with
it. A header that holds neither never does.

## What the recovery keeps

The lenient scan reads `key: value` pairs line by line. It keeps the last value of each key
and recovers two keys:

- `name`
- `description`

Every other key is lost, even when it is written correctly. A skill that recovers its
header runs without its `allowed-tools`, its `license`, its `compatibility` and its
`metadata`.

## The rules that stop the errors

1. Every key of the header starts at the same column.
2. A value sits on the line of its key, or the continuation is indented.
3. A value that holds a colon followed by a space is quoted, and the inner quotes are
   escaped.
4. Every quote is closed, and nothing follows the closing quote.
5. A tab is never used as indentation.
6. A key appears once.
7. The name matches the folder name, in lowercase, with single hyphens.

## How to check a header

The repository holds a checker that applies these rules to every skill:

```bash
npm run check:skills
```

It reports each skill as one of:

- `OK` — the header parses strictly, and every field survives.
- `LENIENT` — the header needs the lenient parser, so only the name and the description
  survive.
- `SKIP` — the loader would drop the skill.

The `yaml-*` skills in this folder are the cases the checker is tested against.

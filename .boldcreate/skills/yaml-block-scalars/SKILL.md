---
name: yaml-block-scalars
description: >-
  Shows the folded and literal block forms, which are the safest way to write a long
  description that spans several lines.
license: MIT
---

# Block scalars

A long description that spans several lines is best written as a block scalar. The strict
parser accepts both forms below, so the loader reads the description in full.

## The folded form

The folded form joins the lines with a space. Use `>-` to strip the trailing newline, `>`
to keep one.

```yaml
---
name: yaml-block-scalars
description: >-
  Shows the folded and literal block forms, which are the safest way to write a long
  description that spans several lines.
license: MIT
---
```

## The literal form

The literal form keeps the line breaks. Use it for a description that reads as a list.

```yaml
---
name: yaml-block-scalars
description: |
  Shows the folded and literal block forms.

  - Folded joins the lines.
  - Literal keeps the line breaks.
license: MIT
---
```

## Notes

- The indentation of the block must be deeper than the key it belongs to.
- An empty line ends a block that uses the literal form.
- A block must not be indented with a tab.

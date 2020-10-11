# @common-utilities/trim-whitespace 🧰⬜️

![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)
[![npm version](https://badge.fury.io/js/%40common-utilities%2Ftrim-whitespace.svg)](https://badge.fury.io/js/%40common-utilities%2Ftrim-whitespace)

A common function for trimming whitespace without regex!

---

## Install

```bash
yarn add @common-utilities/trim-whitespace -D
```

## Function

```typescript
const trimWhitespace = (string) =>
  string
    .trim()
    .split('  ')
    .map((word) => word.trim())
    .filter((word) => word !== '')
    .join(' ')
```

```typescript
const trimWhitespace = (string: string): string =>
  string
    .trim()
    .split('  ')
    .map((word: string): string[] => word.trim())
    .filter((word: string): string[] => word !== '')
    .join(' ')
```

## Usage

```typescript
trimWhitespace('    This is some  really crazy.     string.   ')
// This is some really crazy. string.
```

---

## Common Utilities 🧰

**No cruft. No bloat. No dependencies.**

Simple, typed, functional, documented, and tested javascript utility functions.

---

View other [common utilities](https://github.com/yowainwright/common-utilities).

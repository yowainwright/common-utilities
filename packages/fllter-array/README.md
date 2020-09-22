# @common-utilities/filter-array 🧰🧹

![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)
[![npm version](https://badge.fury.io/js/%40common-utilities%2Ffilter-array.svg)](https://badge.fury.io/js/%40common-utilities%2Ffilter-array)

**FilterArray** is a common function a common function that removes deplicate items from an array.

---

## Install

```bash
yarn add @common-utilities/filter-array -D
```

## Function

```typescript
const filterArray = (arr) => arr.filter((item, index, self) => self.indexOf(item) === index)
```

```typescript
const filterArray = (arr: unknown[]): unknown[] =>
  arr.filter((item: unknown, index: number, self: unknown[]) => self.indexOf(item) === index)
```

## Usage

```typescript
filterArray(['test', 'test', 'foo', 'bar', 'biz'])
// ['test', 'foo', 'bar', 'biz'])
```

---

## Common Utilities 🧰

**No cruft. No bloat. No dependencies.**

Simple, typed, functional, documented, and tested javascript utility functions.

---

View other [common utilities](https://github.com/yowainwright/common-utilities).

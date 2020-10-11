# @common-utilities/trace 🧰👤

![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)
[![npm version](https://badge.fury.io/js/%40common-utilities%2Ftrace.svg)](https://badge.fury.io/js/%40common-utilities%2Ftrace)

A common function for tracing values.

---

## Install

```bash
yarn add @common-utilities/trace -D
```

## Function

```typescript
const trace = (label) => (value) => {
  console.log(`${label}: ${value}`)
  return value
}
```

```typescript
const trace = (label: string) => (value: unknown): unknown => {
  console.log(`${label}: ${value}`)
  return value
}
```

## Usage

```typescript
trace('number')(2)
// logs number 2, awe s**t
```

---

## Common Utilities 🧰

**No cruft. No bloat. No dependencies.**

Simple, typed, functional, documented, and tested javascript utility functions.

---

View other [common utilities](https://github.com/yowainwright/common-utilities).

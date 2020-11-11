# @common-utilities/compose 🧰 🚂

![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)
[![npm version](https://badge.fury.io/js/%40common-utilities%2Fcompose.svg)](https://badge.fury.io/js/%40common-utilities%2Fcompose)

**Compose** is a common function composed of function arguments which returns their value to the next function until returning a final value.

---

## Install

```bash
yarn add @common-utilities/compose -D
```

## Function

**JavaScript**
```typescript
const compose = (...fns) => (val) => fns.reduceRight((fnVal, fn) => fn(fnVal), val)
```

**TypeScript**
```typescript
const compose = (...fns: Function[]) => (val: any) => fns.reduceRight((fnVal: any, fn: Function) => fn(fnVal), val)
```

## Usage

```typescript
const add1 = (val) => val + 1
const subtract2 = (val) => val - 2
const multiplyBy3 = (val) => val * 3
const result = compose(add1, subtract2, multiplyBy3)
// result(3) // 5 (3 + 1 - 3 * 5)
```

---

## Common Utilities 🧰

**No cruft. No bloat. No dependencies.**

Simple, typed, functional, documented, and tested javascript utility functions.

---

View other [common utilities](https://github.com/yowainwright/common-utilities).

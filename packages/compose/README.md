# @common-utilities/compose 🧰 🚂

![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)
![Dependabot](https://badgen.net/dependabot/badgen/yowainwright/common-utilities?icon=dependabot)
[![npm version](https://badge.fury.io/js/%40common-utilities%2Fcompose.svg)](https://badge.fury.io/js/%40common-utilities%2Fcompose)

**Compose** is a common function composed of function arguments which returns their value to the next function until returning a final value.

## Install

```bash
yarn add @common-utilities/compose -D
```

## Function

```javascript
const compose = (...fns) => (val) => fns.reduceRight((fnVal, fn) => fn(fnVal), val)
```

```typescript
const compose = (...fns: Function[]) => (val: any) => fns.reduceRight((fnVal: any, fn: Function) => fn(fnVal), val)
```

## Usage

```javascript
const add1 = (val) => val + 1
const subtract2 = (val) => val - 2
const multiplyBy3 = (val) => val * 3
compose(add1, subtract2, multiplyBy3)
```

---

## Common Utilities 🧰

**No cruft. No bloat. No dependencies.**

Just simiple well documented and tested utilities—so why not use 'em?

View other [common utilities](https://github.com/yowainwright/common-utilities).

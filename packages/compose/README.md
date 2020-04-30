# @common-utilities/compose 🧰 🚂

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

No cruft. No bloat. No dependencies.<br />
Just simiple well documented and tested utilities —so why not use 'em?

View other [common utilities](../../README.md).

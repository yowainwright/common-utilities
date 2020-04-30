# @common-utilities/pipe 🧰⛓

**Pipe** is a common function composed of function arguments which returns their value to the next function until returning a final value in the opposite order of compose

## Install

```bash
yarn add @common-utilities/pipe -D
```

## Function

```javascript
const pipe = (...fns) => (patchedValue) => fns.reduce((fnVal, fn) => fn(fnVal), patchedValue)
```

```typescript
const pipe = (...fns: unknown[]) => (patchedValue: unknown): unknown =>
  fns.reduce((fnVal: unknown, fn: Function) => fn(fnVal), patchedValue)
```

## Usage

```javascript
const add1 = (val) => val + 1
const subtract2 = (val) => val - 2
const multiplyBy3 = (val) => val * 3
pipe(add1, subtract2, multiplyBy3)
```

---

## Common Utilities 🧰

No cruft. No bloat. No dependencies.<br />
Just simiple well documented and tested utilities —so why not use 'em?

View other [common utilities](../../README.md).

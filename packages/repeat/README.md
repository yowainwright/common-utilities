# @common-utilities/repeat 🧰🔁

**Repeat** is a common function composed of function arguments which recursively invoke a callback function based on iterations returning a final value.

The repeat function can be used to replace while loops.

## Install

```bash
yarn add @common-utilities/repeat -D
```

## Function

```javascript
const repeat = (iterations) => (callback) => (initialValue) =>
  iterations === 0 ? initialValue : repeat(iterations - 1)(callback)(callback(initialValue))
```

```typescript
export const repeat = (iterations: number) => (callback: Function) => (initialValue): unknown =>
  iterations === 0 ? initialValue : repeat(iterations - 1)(callback)(callback(initialValue))
```

## Usage

```javascript
const add1 = (val) => val + 1
repeat(100)(add1)(0)
```

---

## Common Utilities 🧰

No cruft. No bloat. No dependencies.<br />
Just simiple well documented and tested utilities —so why not use 'em?

View other [common utilities](../../README.md).

# @common-utilities/trace 🧰👤

A common function for tracing values.

## Install

```bash
yarn add @common-utilities/trace -D
```

## Function

```javascript
export const trace = (label) => (value) => {
  console.log(`${label}: ${value}`)
  return value
}
```

```typescript
export const trace = (label: string) => (value: unknown): unknown => {
  console.log(`${label}: ${value}`)
  return value
}
```

## Usage

```javascript
const result = trace('number')(2)
// logs number 2, awe s**t
```

---

View other [common utilities](../../README.md).

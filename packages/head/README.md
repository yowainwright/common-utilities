# @common-utilities/head 🧰👤

**Head** is a common function for return the value of the first item in an Array.

## Install

```bash
yarn add @common-utilities/head -D
```

## Function

```javascript
const head = ([first]): => first
```

```typescript
const head = ([first]: unknown[]): unknown => first
```

## Usage

```javascript
const input = Array.from(Array(10).keys())
const firstInputItem = head(input)
```

---

## Common Utilities 🧰

No cruft. No bloat. No dependencies.<br />
Just simiple well documented and tested utilities —so why not use 'em?

View other [common utilities](../../README.md).

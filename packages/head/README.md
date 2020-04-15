# @common-utilities/head 🧰👤

A common function for return the value of the first item in an Array.

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

View other [common utilities](../../README.md).

# @common-utilities/head 🧰👤

![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)
[![npm version](https://badge.fury.io/js/%40common-utilities%2Fhead.svg)](https://badge.fury.io/js/%40common-utilities%2Fhead)

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

**No cruft. No bloat. No dependencies.**

Just simple typed functional well documented and tested javascript utility functions—so why not use 'em?

View other [common utilities](https://github.com/yowainwright/common-utilities).

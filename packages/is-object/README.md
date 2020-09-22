# @common-utilities/is-object 🧰🎛

![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)
[![npm version](https://badge.fury.io/js/%40common-utilities%2Fis-object.svg)](https://badge.fury.io/js/%40common-utilities%2is-object)

**IsObject** is a common function for knowings whether data is of Object type.
This function comes with `isArray` and `isOfObjectTypes` helper methods.

---

## Install

```bash
yarn add @common-utilities/is-object -D
```

## Function

JavaScript

```typescript
const isArray = (item) => Array.isArray(item)
const isOfObjectType = (item) => item !== null && typeof item === 'object'
const isObject = (item) => isOfObjectType(item) && !isArray(item)
```

TypeScript

```typescript
const isArray = (item: unknown): boolean => Array.isArray(item)
const isOfObjectType = (item: unknown): boolean => item !== null && typeof item === 'object'
const isObject = (item: unknown): boolean => isOfObjectType(item) && !isArray(item)
```

## Usage

isArray

```typescript
const result = isArray(['test', 'test']) // true
const result = isArray({ foo: 'test' }) // false
```

isOfObjectType

```typescript
const result = isOfObjectType(['test', 'test']) // true
const result = isOfObjectType({ foo: 'test' }) // true
const result = isOfObjectType(9) // false
const result = isOfObjectType('string') // false
const result = isOfObjectType(null) // false
const result = isOfObjectType(undefined) // false
```

isObject

```typescript
const result = isObject(['test', 'test']) // false
const result = isObject({ foo: 'test' }) // true
```

---

## Common Utilities 🧰

**No cruft. No bloat. No dependencies.**

Just simple typed functional well documented and tested javascript utility functions—so why not use 'em?

---

View other [common utilities](https://github.com/yowainwright/common-utilities).

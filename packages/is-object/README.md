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

## Usage

isArray

```javascript
isArray(['test', 'test']) // true
isArray({ foo: 'test' }) // false
```

isOfObjectType

```javascript
isOfObjectType(['test', 'test']) // true
isOfObjectType({ foo: 'test' }) // true
isOfObjectType(9) // false
isOfObjectType('string') // false
isOfObjectType(null) // false
isOfObjectType(undefined) // false
```

isObject

```javascript
isObject(['test', 'test']) // false
isObject({ foo: 'test' }) // true
```

---

## Common Utilities 🧰

**No cruft. No bloat. No dependencies.**

Simple, typed, functional, documented, and tested javascript utility functions.

---

View other [common utilities](https://github.com/yowainwright/common-utilities).

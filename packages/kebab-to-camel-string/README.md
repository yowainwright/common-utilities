# @common-utilitiee/kebab-to-camel-string 🧰🍢🐫

![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)
[![npm version](https://badge.fury.io/js/%40common-utilities%2Fkebab-to-camel-string.svg)](https://badge.fury.io/js/%40common-utilities%2Fkebab-to-camel-string)

**kebabToCamelString** is a common function for returning a kebab string as a camel string.

---

## Install

```bash
yarn add @common-utilitiee/kebab-to-camel-string -D
```

## Function

```javascript
// string
const kebabToCamelString = (kebabString) =>
  kebabString
    .split('-')
    .map((camelString, i) =>
      i === 0 ? camelString : camelString ? `${camelString.charAt(0).toUpperCase()}${camelString.slice(1)}` : '',
    )
    .join('')

// object
const kebabToCamelStringsInObject = (kebabObjectStrings) =>
  Object.keys(kebabObjectStrings).length
    ? Object.entries(kebabObjectStrings)
        .map(([kebabKey, value]) => [`${kebabToCamelString(kebabKey)}`, value])
        .reduce((flags, [key, value]) => Object.assign(flags, { [key]: value }), {})
    : {}
```

## Usage

```javascript
// string
kebabToCamelString('test-thing')
// testThing

// object
kebabToCamelStringsInObject({ 'test-thing': 'foo' })
// { testThing: 'foo' }
```

---

## Common Utilities 🧰

**No cruft. No bloat. No dependencies.**

Simple, typed, functional, documented, and tested javascript utility functions.

---

View other [common utilities](https://github.com/yowainwright/common-utilities).

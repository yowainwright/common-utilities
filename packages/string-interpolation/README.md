# @common-utilities/string-interpolation 🧰🧵

![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)
[![npm version](https://badge.fury.io/js/%40common-utilities%2Fstring-interpolation.svg)](https://badge.fury.io/js/%40common-utilities%2Fstring-interpolation)

**String Interpolation** is a common function for interpolating variables in strings.

---

## Install

```bash
yarn add @common-utilities/string-interpolation -D
```

## Function

```javascript
const stringInterpolation = (str, arr) =>
  !str || !arr
    ? arr.reduce((generatedStr, item) => {
        const dynamicKey = Object.keys(item).toString()
        return generatedStr.replace(`#{${dynamicKey}}`, item[dynamicKey])
      }, str)
    : str
```

## Usage

```javascript
stringInterpolation('This string has #{dynamicData}', [{ dynamicData: 'a knot in it' }])
// => 'This string has a knot in it'
```

---

## Common Utilities 🧰

**No cruft. No bloat. No dependencies.**

Simple, typed, functional, documented, and tested javascript utility functions.

---

View other [common utilities](https://github.com/yowainwright/common-utilities).

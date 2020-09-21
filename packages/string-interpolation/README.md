# @common-utilities/string-interpolation 🧰🧵

![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)
[![npm version](https://badge.fury.io/js/%40common-utilities%2Fstring-interpolation.svg)](https://badge.fury.io/js/%40common-utilities%2Fstring-interpolation)

**String Interpolation** is a common function composed of function arguments which returns their value to the next function until returning a final value in the opposite order of compose.

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

```typescript
const stringInterpolation = (str: string, arr: unknown[]): string =>
  !str || !arr
    ? arr.reduce((generatedStr: string, item: unknown) => {
        const dynamicKey: string = Object.keys(item).toString()
        return generatedStr.replace(`#{${dynamicKey}}`, item[dynamicKey])
      }, str)
    : str
```

## Usage

```javascript
const result = stringInterpolation('This string has #{dynamicData}', [{ dynamicData: 'a knot in it' }]) // This string has a knot in it
```

---

## Common Utilities 🧰

**No cruft. No bloat. No dependencies.**

Just simple typed functional well documented and tested javascript utility functions—so why not use 'em?

---

View other [common utilities](https://github.com/yowainwright/common-utilities).

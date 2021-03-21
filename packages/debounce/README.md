# @common-utilities/debounce 🧰 🏓

![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)
[![npm version](https://badge.fury.io/js/%40common-utilities%2Fdebounce.svg)](https://badge.fury.io/js/%40common-utilities%2Fdebounce)

**Debounce** is a common function that waits a set amount of time before invoking a callback.

---

## Install

```bash
yarn add @common-utilities/debounce -D
```

## Usage

```javascript
let result = 1
const add1 = (val) => {
  result = val + 1
}
debounce(add1, 1000)(1) // returns 2, after 1 second
```

---

## Common Utilities 🧰

**No cruft. No bloat. No dependencies.**

Simple, typed, functional, documented, and tested javascript utility functions.

---

View other [common utilities](https://github.com/yowainwright/common-utilities).

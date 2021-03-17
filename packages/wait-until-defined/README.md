# @common-utilities/wait-until-defined 🧰 🚂

![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)
[![npm version](https://badge.fury.io/js/%40common-utilities%2Fwait-until-defined.svg)](https://badge.fury.io/js/%40common-utilities%2Fwait-until-defined)

**Wait Until Defined** is a common utility that waits and checks for a callback function to returns true. This is useful to wait until data is defined.

---

## Install

```bash
yarn add @common-utilities/wait-until-defined -D
```

## Usage

```javascript
setTimeout(() => (window.Test = 'yay'), 2000)
const hasWindowTest = () => window.Test === 'test'
const test = async () => {
  const check = await waitUntilDefined(hasWindowTest, 50, 3000)
  return check
}
// true
```

---

## Common Utilities 🧰

**No cruft. No bloat. No dependencies.**

Simple, typed, functional, documented, and tested javascript utility functions.

---

View other [common utilities](https://github.com/yowainwright/common-utilities).

# @common-utilities/wait-until-defined 🧰 🚂

![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)
[![npm version](https://badge.fury.io/js/%40common-utilities%2Fwait-until-defined.svg)](https://badge.fury.io/js/%40common-utilities%2Fwait-until-defined)

**Wait Until Defined** is a common utility...

---

## Install

```bash
yarn add @common-utilities/wait-until-defined -D
```

## Function

```javascript
const wait = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout))
const isDefined = (callbackFn) => new Promise((resolve) => resolve(callbackFn()))
const checkDefinition = async (callbackFn, timeout, count) => {
  const definition = await isDefined(callbackFn)
  if (definition) {
    return definition
  } else {
    await wait(timeout)
    return checkDefinition(callbackFn, timeout, count - 1)
  }
}
const waitUntilDefined = async (callbackFn, interval, timeout) => {
  const count = timeout / interval
  const definition = await checkDefinition(callbackFn, interval, count)
  return definition
}
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

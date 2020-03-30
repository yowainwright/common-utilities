# Common Utilities

This repository contains common utilities for javascript development.

These methods are used and written elsewhere ([LoDash](https://lodash.com/), [Ramda](https://ramdajs.com/docs/)). This repository is beneficial to me and may be beneficial to others because it documents common JavaScript utilities functions for those that are learning them.

---

[Packages](#packages) | [Compose](#compose)

---

## Packages

Listed below are Common Utilities packages

| Package                                        | Utility                                                                                                                                                    |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [@common-utilities/compose](/packages/compose) | takes the output from one function and patches it to the input of the next function until it delivers a final return value                                 |
| [@common-utilities/head](/packages/head)       | returns the first value of an array                                                                                                                        |
| [@common-utilities/pipe](/packages/pipe)       | takes the output from one function and patches it to the input of the next function until it delivers a final return value in the reverse order of compose |
| [@common-utilities/trace](/packages/trace)     | functionally logs values                                                                                                                                   |
| [@common-utilities/repeat](/packages/repeat)   | a functional recursive method to replace a do while loop based on a certain length                                                                         |

---

## Compose 🚂

A common function that take the output from one function and automatically patches it to the input of the next function until it spits out the final value.

### Function

```javascript
const compose = (...fns) => patchedValue => fns.reduceRight((fnVal, fn) => fn(fnVal), patchedValue)
```

### Usage

```
compose(
  add(2),
  subtract(3),
  multiple(5)
)
```

---

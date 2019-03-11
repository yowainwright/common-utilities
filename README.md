# Common Utilities

This repository contains common utilities for javascript development.

These methods are used and written elsewhere ([LoDash](), [Ramda]()). This repository is beneficial to me and may be beneficial to others because it documents common JavaScript utilities functions for those that are learning them.

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

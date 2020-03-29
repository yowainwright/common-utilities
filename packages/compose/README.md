# @common-utilities/compose

A common function that take the output from one function and automatically patches it to the input of the next function until it spits out the final value.

## Function

```javascript
const compose = (...fns) => patchedValue =>
  fns.reduceRight((fnVal, fn) => fn(fnVal), patchedValue);
```

## Usage

```javascript
compose(add(2), subtract(3), multiple(5));
```

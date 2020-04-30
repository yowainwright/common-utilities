# Common Utilities 🧰

![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

**No cruft. No bloat. No dependencies.**

Just simple typed functional well documented and tested javascript utility functions—so why not use 'em?

---

[Packages](#packages) | [Gloassary](#glossary) | [Cites](#cites)

---

## Packages

Common Utilities provides bite-sized packages of each utility. Use what it needed without what is not.

| Package                                        | Utility                                                                                       |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [@common-utilities/compose](/packages/compose) | passes function value until it delivers a final return value                                  |
| [@common-utilities/head](/packages/head)       | returns the first value of an array                                                           |
| [@common-utilities/pipe](/packages/pipe)       | passes function value until it delivers a final return value in the opposite order of compose |
| [@common-utilities/trace](/packages/trace)     | functionally logs values                                                                      |
| [@common-utilities/repeat](/packages/repeat)   | recursively replaces a value based on a certain length                                        |

---

## Glossary

Below are sectioned descriptions and usages of each implemented Common Utility.

[Compose](#compose) | [Head](#head) | [Pipe](#pipe) | [Trace](#trace) | [Repeat](#repeat)

---

### [Compose](/packages/compose) 🚂

**Compose** is a common function that take the output from one function and automatically patches it to the input of the next function until it spits out the final value.

#### Function

```javascript
const compose = (...fns) => (patchedValue) => fns.reduceRight((fnVal, fn) => fn(fnVal), patchedValue)
```

#### Usage

```javascript
compose(add1, subtract3, multipleBy5)
```

---

### [Head](/packages/head) 👤

**Head** is a common function for return the value of the first item in an Array.

#### Function

```javascript
const head = ([first]) => first
```

#### Usage

```javascript
head([0, 1, 2, 3, 4])
```

---

### [Pipe](/packages/pipe) ⛓

**Pipe** is a common function that take the output from one function and automatically patches it to the input of the next function until it spits out the final value in the opposite order of Compose.

#### Function

```javascript
const pipe = (...fns) => (patchedValue) => fns.reduce((fnVal, fn) => fn(fnVal), patchedValue)
```

#### Usage

```javascript
pipe(add1, subtract2, multipleBy3)
```

---

### [Repeat](/package/repeat) 🖋

**Repeat** is a common function composed of function arguments which recursively invoke a callback function based on iterations returning a final value

#### Function

```javascript
const repeat = (iterations) => (callback) => (initialValue) =>
  iterations === 0 ? initialValue : repeat(iterations - 1)(callback)(callback(initialValue))
```

#### Usage

```javascript
const add1 = (val) => val + 1
repeat(100)(add1)(0)
```

---

## Cites

Many packaged Common Utilities are written very well, elsewhere. See [LoDash](https://lodash.com/) and [Ramda](https://ramdajs.com/docs/)).

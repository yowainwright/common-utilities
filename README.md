# Common Utilities 🧰

Common functional typed utilities functions for javascript development.

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

Below are sectioned descriptions and usages of eact implemented Common Utility.

### Compose 🚂

A common function that take the output from one function and automatically patches it to the input of the next function until it spits out the final value.

#### Function

```javascript
const compose = (...fns) => (patchedValue) => fns.reduceRight((fnVal, fn) => fn(fnVal), patchedValue)
```

#### Usage

```javascript
compose(add1, subtract3, multipleBy5)
```

---

### Head 👤

A common function for return the value of the first item in an Array.

#### Function

```javascript
export const head = ([first]) => first
```

#### Usage

```javascript
head([0, 1, 2, 3, 4])
```

---

### Pipe ⛓

A common function that take the output from one function and automatically patches it to the input of the next function until it spits out the final value in the opposite order of Compose.

#### Function

```javascript
const pipe = (...fns) => (patchedValue) => fns.reduce((fnVal, fn) => fn(fnVal), patchedValue)
```

#### Usage

```javascript
pipe(add1, subtract2, multipleBy3)
```

## Cites

Many packaged Common Utilities are written elsewhere ([LoDash](https://lodash.com/), [Ramda](https://ramdajs.com/docs/)). Common Utilities defines and simplifies functions useful for everyday JavaScript development.

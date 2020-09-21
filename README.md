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

| Package                                                                  | Utility                                                                                       |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| [@common-utilities/compose](/packages/compose)                           | passes function value until it delivers a final return value                                  |
| [@common-utilities/head](/packages/head)                                 | returns the first value of an array                                                           |
| [@common-utilities/pipe](/packages/pipe)                                 | passes function value until it delivers a final return value in the opposite order of compose |
| [@common-utilities/trace](/packages/trace)                               | functionally logs values                                                                      |
| [@common-utilities/repeat](/packages/repeat)                             | recursively replaces a value based on a certain length                                        |
| [@common-utilities/filter-array](/packages/filter-array)                 | removes duplicates from an array                                                              |
| [@common-utilities/is-object](/packages/is-object)                       | determines if data is of object type                                                          |
| [@common-utilities/merge-objects](/packages/merge-objects)               | deeply merges 2 objects                                                                       |
| [@common-utilities/string-interpolation](/packages/string-interpolation) | interpolating variables in strings                                                            |

---

## Glossary

Below are sectioned descriptions and usages of each implemented Common Utility.

[Compose](#compose) | [Head](#head) | [Pipe](#pipe) | [Trace](#trace) | [Repeat](#repeat) | [Filter-Array](#filter-array) | [Is-Object](#is-object) | [Merge-Objects](#merge-objects) | [String-interpolation](#string-interpolation)

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

### [Repeat](/packages/repeat) 🖋

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

### [Filter-Array](/packages/filter-array) 🧹

**FilterArray** is a common function a common function that removes deplicate items from an array.

```javascript
const filterArray = (arr) => arr.filter((item, index, self) => self.indexOf(item) === index)
```

#### Usage

```javascript
const result = filterArray(['test', 'test', 'foo', 'bar', 'biz']) // ['test', 'foo', 'bar', 'biz'])
```

---

### [Is-Object](/packages/is-object) 🎛

**IsObject** is a common function for knowings whether data is of Object type.
This function comes with `isArray` and `isOfObjectTypes` helper methods.

#### Function

```javascript
const isArray = (item) => Array.isArray(item)
const isOfObjectType = (item) => item !== null && typeof item === 'object'
const isObject = (item) => isOfObjectType(item) && !isArray(item)
```

#### Usage

isArray

```javascript
const result = isArray(['test', 'test']) // true
const result = isArray({ foo: 'test' }) // false
```

isOfObjectType

```javascript
const result = isOfObjectType(['test', 'test']) // true
const result = isOfObjectType({ foo: 'test' }) // true
const result = isOfObjectType(9) // false
const result = isOfObjectType('string') // false
const result = isOfObjectType(null) // false
const result = isOfObjectType(undefined) // false
```

isObject

```javascript
const result = isObject(['test', 'test']) // false
const result = isObject({ foo: 'test' }) // true
```

---

### [Merge-Objects](/packages/merge-objects) 👯‍♂️

**MergeObjects** is a common function for merging two objects deeply.

#### Function

```javascript
const mergeObjects = (item, otherItem) => {
  if ((!isObject(item) && !isArray(item)) || (!isObject(otherItem) && !isArray(otherItem))) {
    return item
  }
  if (isArray(item) && isArray(otherItem)) {
    return filterArray([...item, ...otherItem])
  }

  return filterArray([...Object.keys(item), ...Object.keys(otherItem)]).reduce((acc, key: string) => {
    if (typeof acc[key] === 'undefined') {
      acc[key] = otherItem[key]
    } else if (isObject(acc[key]) || isArray(acc[key])) {
      acc[key] = mergeObjects(item[key], otherItem[key])
    } else if (acc[key] !== otherItem[key] && typeof otherItem[key] !== 'undefined') {
      acc[key] = otherItem[key]
    }
    return acc
  }, item)
}
```

#### Usage

```javascript
const result = mergeObjects({ foo: 'bar' }, { baz: 'biz' })
```

### [String-interpolation](/packages/string-interpolation) 🧵

**String Interpolation** is a common function for interpolating variables in strings.

#### Function

```javascript
const stringInterpolation = (str, arr) =>
  !str || !arr
    ? arr.reduce((generatedStr, item) => {
        const dynamicKey = Object.keys(item).toString()
        return generatedStr.replace(`#{${dynamicKey}}`, item[dynamicKey])
      }, str)
    : str
```

#### Usage

```javascript
const result = stringInterpolation('This string has #{dynamicData}', [{ dynamicData: 'a knot in it' }]) // This string has a knot in it
```

---

## Cites

Many packaged Common Utilities are written very well, elsewhere. See [LoDash](https://lodash.com/) and [Ramda](https://ramdajs.com/docs/)).

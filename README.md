# Common Utilities 🧰

![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

**No cruft. No bloat. No dependencies.**

Simple, typed, functional, documented, and tested javascript utility functions.

---

[Packages](#packages) | [Gloassary](#glossary) | [Cites](#cites)

---

## Packages

Common Utilities provides bite-sized packages of each utility. Use what it needed without what is not.

| Package                                                                    | Utility                                                                                       |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [@common-utilities/compose](/packages/compose)                             | passes function value until it delivers a final return value                                  |
| [@common-utilities/head](/packages/head)                                   | returns the first value of an array                                                           |
| [@common-utilities/pipe](/packages/pipe)                                   | passes function value until it delivers a final return value in the opposite order of compose |
| [@common-utilities/trace](/packages/trace)                                 | functionally logs values                                                                      |
| [@common-utilities/repeat](/packages/repeat)                               | recursively replaces a value based on a certain length                                        |
| [@common-utilities/filter-array](/packages/filter-array)                   | removes duplicates from an array                                                              |
| [@common-utilities/is-object](/packages/is-object)                         | determines if data is of object type                                                          |
| [@common-utilities/merge-objects](/packages/merge-objects)                 | deeply merges 2 objects                                                                       |
| [@common-utilities/string-interpolation](/packages/string-interpolation)   | interpolating variables in strings                                                            |
| [@common-utilities/kebab-to-camel-string](/packages/kebab-to-camel-string) | returns a kebab string as a camel string                                                      |

---

## Glossary

Below are sectioned descriptions and usages of each implemented Common Utility.

[Compose](#compose) | [Head](#head) | [Pipe](#pipe) | [Trace](#trace) | [Repeat](#repeat) | [Filter-Array](#filter-array) | [Is-Object](#is-object) | [Merge-Objects](#merge-objects) | [String-interpolation](#string-interpolation) | [Kebab-to-camel-string](#kebab-to-camel-string)

---

### [Compose](/packages/compose) 🚂

**Compose** is a common function that take the output from one function and automatically patches it to the input of the next function until it spits out the final value.

#### Function

```typescript
const compose = (...fns) => (patchedValue) => fns.reduceRight((fnVal, fn) => fn(fnVal), patchedValue)
```

#### Usage

```typescript
const result = compose(add1, subtract3, multipleBy5)
// result(3) // 5 (3 + 1 - 3 * 5)
```

---

### [Head](/packages/head) 👤

**Head** is a common function for return the value of the first item in an Array.

#### Function

```typescript
const head = ([first]) => first
```

#### Usage

```typescript
head([0, 1, 2, 3, 4]) // 01
```

---

### [Pipe](/packages/pipe) ⛓

**Pipe** is a common function that take the output from one function and automatically patches it to the input of the next function until it spits out the final value in the opposite order of Compose.

#### Function

```typescript
const pipe = (...fns) => (patchedValue) => fns.reduce((fnVal, fn) => fn(fnVal), patchedValue)
```

#### Usage

```typescript
const result = pipe(add1, subtract2, multipleBy3)
// result(3) // 8 (3 * 3 - 2 + 1)
```

---

### [Repeat](/packages/repeat) 🖋

**Repeat** is a common function composed of function arguments which recursively invoke a callback function based on iterations returning a final value

#### Function

```typescript
const repeat = (iterations) => (callback) => (initialValue) =>
  iterations === 0 ? initialValue : repeat(iterations - 1)(callback)(callback(initialValue))
```

#### Usage

```typescript
const add1 = (val) => val + 1
repeat(100)(add1)(0) // 100
```

---

### [Filter-Array](/packages/filter-array) 🧹

**FilterArray** is a common function a common function that removes deplicate items from an array.

```typescript
const filterArray = (arr) => arr.filter((item, index, self) => self.indexOf(item) === index)
```

#### Usage

```typescript
filterArray(['test', 'test', 'foo', 'bar', 'biz']) // ['test', 'foo', 'bar', 'biz'])
```

---

### [Is-Object](/packages/is-object) 🎛

**IsObject** is a common function for knowings whether data is of Object type.
This function comes with `isArray` and `isOfObjectTypes` helper methods.

#### Function

```typescript
const isArray = (item) => Array.isArray(item)
const isOfObjectType = (item) => item !== null && typeof item === 'object'
const isObject = (item) => isOfObjectType(item) && !isArray(item)
```

#### Usage

isArray

```typescript
isArray(['test', 'test']) // true
isArray({ foo: 'test' }) // false
```

isOfObjectType

```typescript
isOfObjectType(['test', 'test']) // true
isOfObjectType({ foo: 'test' }) // true
isOfObjectType(9) // false
isOfObjectType('string') // false
isOfObjectType(null) // false
isOfObjectType(undefined) // false
```

isObject

```typescript
isObject(['test', 'test']) // false
isObject({ foo: 'test' }) // true
```

---

### [Merge-Objects](/packages/merge-objects) 👯‍♂️

**MergeObjects** is a common function for merging two objects deeply.

#### Function

```typescript
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

```typescript
mergeObjects({ foo: 'bar' }, { baz: 'biz' }) // { foo: 'bar', baz: 'biz' }
```

### [String-interpolation](/packages/string-interpolation) 🧵

**String Interpolation** is a common function for interpolating variables in strings.

#### Function

```typescript
const stringInterpolation = (str, arr) =>
  !str || !arr
    ? arr.reduce((generatedStr, item) => {
        const dynamicKey = Object.keys(item).toString()
        return generatedStr.replace(`#{${dynamicKey}}`, item[dynamicKey])
      }, str)
    : str
```

#### Usage

```typescript
stringInterpolation('This string has #{dynamicData}', [{ dynamicData: 'a knot in it' }])
// => 'This string has a knot in i
```

### [Kebab-to-camel-string](/packages/kebab-to-camel-string) 🍢🐫

**kebabToCamelString** is a common function for returning a kebab string as a camel string.

#### Function

```typescript
// string
const kebabToCamelString = (kebabString) =>
  kebabString
    .split('-')
    .map((camelString, i) =>
      i === 0 ? camelString : camelString ? `${camelString.charAt(0).toUpperCase()}${camelString.slice(1)}` : '',
    )
    .join('')

// object
const kebabToCamelStringsInObject = (kebabObjectStrings) =>
  Object.keys(kebabObjectStrings).length
    ? Object.entries(kebabObjectStrings)
        .map(([kebabKey, value]) => [`${kebabToCamelString(kebabKey)}`, value])
        .reduce((flags, [key, value]) => Object.assign(flags, { [key]: value }), {})
    : {}
```

#### Usage

```typescript
// string
kebabToCamelString('test-thing')
// testThing

// object
kebabToCamelStringsInObject({ 'test-thing': 'foo' })
// { testThing: 'foo' }
```

---

## Cites

Many/all of these Common Utilities packages are written very well elsewhere.
See [LoDash](https://lodash.com/) and [Ramda](https://ramdajs.com/docs/)).

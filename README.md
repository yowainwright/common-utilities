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
| [@common-utilities/trim-whitespace](/packages/trim-whitespace)             | returns a string with trimmed whitespace                                                      |

---

## Glossary

Below are sectioned descriptions and usages of each implemented Common Utility.

[Compose](#compose-) | [Head](#head-) | [Pipe](#pipe-) | [Trace](#trace-) | [Repeat](#repeat-) | [Filter-Array](#filter-array-) | [Is-Object](#is-object-) | [Merge-Objects](#merge-objects-) | [String-interpolation](#string-interpolation-) | [Kebab-to-camel-string](#kebab-to-camel-string-) | [Trim-whitespace](#trim-whitespace-)

---

### Compose 🚂

**[Compose](/packages/compose)** is a common function that take the output from one function and automatically patches it to the input of the next function until it spits out the final value.

#### Function

```javascript
const compose = (...fns) => (patchedValue) => fns.reduceRight((fnVal, fn) => fn(fnVal), patchedValue)
```

#### Usage

```javascript
const result = compose(add1, subtract3, multipleBy5)
// result(3) // 5 (3 + 1 - 3 * 5)
```

---

### Head 👤

**[Head](/packages/head)** is a common function for return the value of the first item in an Array.

#### Function

```javascript
const head = ([first]) => first
```

#### Usage

```javascript
head([0, 1, 2, 3, 4]) // 01
```

---

### Pipe ⛓

**[Pipe](/packages/pipe)** is a common function that take the output from one function and automatically patches it to the input of the next function until it spits out the final value in the opposite order of Compose.

#### Function

```javascript
const pipe = (...fns) => (patchedValue) => fns.reduce((fnVal, fn) => fn(fnVal), patchedValue)
```

#### Usage

```javascript
const result = pipe(add1, subtract2, multipleBy3)
// result(3) // 8 (3 * 3 - 2 + 1)
```

---

### Repeat 🖋

**[Repeat](/packages/repeat)** is a common function composed of function arguments which recursively invoke a callback function based on iterations returning a final value

#### Function

```javascript
const repeat = (iterations) => (callback) => (initialValue) =>
  iterations === 0 ? initialValue : repeat(iterations - 1)(callback)(callback(initialValue))
```

#### Usage

```javascript
const add1 = (val) => val + 1
repeat(100)(add1)(0) // 100
```

---

### Filter-Array 🧹

**[Filter Array](/packages/filter-array)** is a common function a common function that removes deplicate items from an array.

#### Function

```javascript
const filterArray = (arr) => arr.filter((item, index, self) => self.indexOf(item) === index)
```

#### Usage

```javascript
filterArray(['test', 'test', 'foo', 'bar', 'biz']) // ['test', 'foo', 'bar', 'biz'])
```

---

### Is-Object 🎛

**[IsObject](/packages/is-object)** is a common function for knowings whether data is of Object type.
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
isArray(['test', 'test']) // true
isArray({ foo: 'test' }) // false
```

isOfObjectType

```javascript
isOfObjectType(['test', 'test']) // true
isOfObjectType({ foo: 'test' }) // true
isOfObjectType(9) // false
isOfObjectType('string') // false
isOfObjectType(null) // false
isOfObjectType(undefined) // false
```

isObject

```javascript
isObject(['test', 'test']) // false
isObject({ foo: 'test' }) // true
```

---

### Merge-Objects👯‍♂️

**[Merge Objects](/packages/merge-objects)** is a common function for merging two objects deeply.

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
mergeObjects({ foo: 'bar' }, { baz: 'biz' }) // { foo: 'bar', baz: 'biz' }
```

### String-interpolation 🧵

**[String Interpolation](/packages/string-interpolation)** is a common function for interpolating variables in strings.

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
stringInterpolation('This string has #{dynamicData}', [{ dynamicData: 'a knot in it' }])
// => 'This string has a knot in i
```

### Kebab-to-camel-string 🍢🐫

**[Kebab to Camel String](/packages/kebab-to-camel-string)** is a common function for returning a kebab string as a camel string.

#### Function

```javascript
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

```javascript
// string
kebabToCamelString('test-thing')
// testThing

// object
kebabToCamelStringsInObject({ 'test-thing': 'foo' })
// { testThing: 'foo' }
```

---

### Trim-whitespace 🍢🐫

**[Trim Whitespace](/packages/trim-whitespace)** is a common function for returning a string with trimmed text.

#### Function

```javascript
const trimWhitespace = (string) =>
  string
    .trim()
    .split('  ')
    .map((word) => word.trim())
    .filter((word) => word !== '')
    .join(' ')
```

#### Usage

```javascript
trimWhitespace('    This is some  really crazy.     string.   ')
// This is some really crazy. string.
```

---

## Cites

Many/all of these Common Utilities packages are written very well elsewhere.
See [LoDash](https://lodash.com/) and [Ramda](https://ramdajs.com/docs/) for a great start!

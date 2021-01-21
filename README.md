# Common Utilities 🧰

![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

#### No cruft. No bloat. No dependencies.

Simple, typed, functional, documented, and tested javascript utility functions.

## Why

Common Utilities fills a gap between 1-line-of-code (1LOC) JavaScript utility solutions and large JavaScript utility libraries. If having tested code chunks and brevity is optimal when importing a utlity, consider Common Utilities!

#### Common Utilities 🧰 &nbsp; or 1-line-of-code

Common Utilities provides an option to [1LOC](https://1loc.dev/) because each function can be imported rather than copied. This ensures that you don't need to write your own tests while knowing you're using easy to read tested code!

#### Common Utilities 🧰 &nbsp; or Utilities Libraries

Common Utilities provides an option focused on simplicity compared to [Ramba](https://ramdajs.com/) or [Lodash](https://lodash.com/) because it provides solutions to many common JavaScript utility functions in a basic way. 

Where Ramba and Lodash provides better overall coverage for what each JavaScript utility does, they also are more challenging to quickly know if the code does what **you** need it to do. 

Also, Libraries like [Ramda](https://ramdajs.com/#usage) and [Lodash](https://lodash.com/per-method-packages) may assume that you [tree shake](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) unused code in your build pipeline and are generally more bytes of code.

---

[Packages](#packages) | [Gloassary](#glossary) | [Cites](#cites)

---

## Packages

Common Utilities provides bite-sized packages of each utility.
Use what it needed without what is not.

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
| [@common-utilities/wait-until-defined](/packages/wait-until-defined)       | waits and checks for a callback function to returns true                                      |

---

## Glossary

Below are sectioned descriptions and code usages of each implemented Common Utility. Read more about each common utility within each package's README!

[Compose](#compose-) | [Head](#head-) | [Pipe](#pipe-) | [Trace](#trace-) | [Repeat](#repeat-) | [Filter-Array](#filter-array-) | [Is-Object](#is-object-) | [Merge-Objects](#merge-objects-) | [String-interpolation](#string-interpolation-) | [Kebab-to-camel-string](#kebab-to-camel-string-) | [Trim-whitespace](#trim-whitespace-) | [Wait-until-defined](#wait-until-defined-) |

---

### Compose 🚂

**[Compose](/packages/compose)** is a common function that take the output from one function and automatically patches it to the input of the next function until it spits out the final value.

Compose is useful for computing a series of functions in a composed fashion improving code readability and testability.

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

### Head 👤

**[Head](/packages/head)** is a common function for return the value of the first item in an Array.

#### Function

```typescript
const head = ([first]) => first
```

#### Usage

```typescript
head([0, 1, 2, 3, 4]) // 01
```

---

### Pipe ⛓

**[Pipe](/packages/pipe)** is a common function that take the output from one function and automatically patches it to the input of the next function until it spits out the final value in the opposite order of Compose.

Like compose, Pipe is useful for computing a series of functions in a composed fashion improving code readability and testability but in the opposite order of Compose.

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

### Repeat 🖋

**[Repeat](/packages/repeat)** is a common function composed of function arguments which recursively invoke a callback function based on iterations returning a final value.

Repeat is useful for declaritively performing a while loop, making it more testable.

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

### Filter-Array 🧹

**[Filter Array](/packages/filter-array)** is a common function a common function that removes deplicate items from an array.

Filter is useful for ensuring an array is exact.

#### Function

```typescript
const filterArray = (arr) => arr.filter((item, index, self) => self.indexOf(item) === index)
```

#### Usage

```typescript
filterArray(['test', 'test', 'foo', 'bar', 'biz']) // ['test', 'foo', 'bar', 'biz'])
```

---

### Is-Object 🎛

**[IsObject](/packages/is-object)** is a common function for knowings whether data is of Object type.
This function comes with `isArray` and `isOfObjectTypes` helper methods.

Is object is useful for determining that an object is an object **and** not an array.

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

### Merge-Objects👯‍♂️

**[Merge Objects](/packages/merge-objects)** is a common function for merging two objects deeply.

Merge Objects is useful for merging objects with nested object and/or array properties.

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

### String-interpolation 🧵

**[String Interpolation](/packages/string-interpolation)** is a common function for interpolating variables in strings.

String Interpolation is useful for adding dynamic data to strings.

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

### Kebab-to-camel-string 🍢🐫

**[Kebab to Camel String](/packages/kebab-to-camel-string)** is a common function for returning a kebab string as a camel string.

Kebab to Camel String is useful for switching objects from kebab case to camel case which is more usable in JavaScript.

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

### Trim-whitespace 🍢🐫

**[Trim Whitespace](/packages/trim-whitespace)** is a common function for returning a string with trimmed text.

Trim-whitespace is useful for removing extra spaces from inputed strings.

#### Function

```typescript
const trimWhitespace = (string) =>
  string
    .trim()
    .split('  ')
    .map((word) => word.trim())
    .filter((word) => word !== '')
    .join(' ')
```

#### Usage

```typescript
trimWhitespace('    This is some  really crazy.     string.   ')
// This is some really crazy. string.
```

### Wait-until-defined ⌚️

**[Wait-until-defined](/packages/wait-until-defined)** is a common function for waiting until data is defined via a callback which returns a boolean.

Wait-until-defined is useful for waiting until some data type is defined.

#### Function

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

#### Usage

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

## Cites

Many/all of these Common Utilities are written very well elsewhere.

See [1LOC](https://1loc.dev/), [LoDash](https://lodash.com/), and [Ramda](https://ramdajs.com/docs/) for a great start!

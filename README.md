# Common Utilities 🧰

![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)


#### No cruft. No bloat. No dependencies.

Simple, typed, functional, documented, and tested javascript utility functions.

---

> **Common Utilities** fills a gap between 1-line-of-code (1LOC) JavaScript utility solutions and large JavaScript utility libraries. If having typed, tested JavaScript utility functions and brevity is what you want, consider Common Utilities! Read the slightly longer [comparision](#comparision) for more insight.

---

[Docs](https://www.common-utilities.com) | [Packages](#packages) | [Gloassary](#glossary) | [Cites](#cites)

---

## Packages

Common Utilities provides bite-sized packages of each utility.
Use what it needed without what is not.

| Package | Version | Utility |
| -------------------------------------------------------------------------- | --- | --------------------------------------------------------------------------------------------- |
| [Compose](/packages/compose)                             | [![npm version](https://badge.fury.io/js/%40common-utilities%2Fcompose.svg)](https://badge.fury.io/js/%40common-utilities%2Fcompose) | passes function value until it delivers a final return value                                  |
| [Head](/packages/head)                                   | [![npm version](https://badge.fury.io/js/%40common-utilities%2Fhead.svg)](https://badge.fury.io/js/%40common-utilities%2Fhead) | returns the first value of an array                                                           |
| [Pipe](/packages/pipe)                                   | [![npm version](https://badge.fury.io/js/%40common-utilities%2Fpipe.svg)](https://badge.fury.io/js/%40common-utilities%2Fpipe) | passes function value until it delivers a final return value in the opposite order of compose |
| [Trace](/packages/trace)                                 | [![npm version](https://badge.fury.io/js/%40common-utilities%2Ftrace.svg)](https://badge.fury.io/js/%40common-utilities%2Ftrace) | functionally logs values                                                                      |
| [Repeat](/packages/repeat)                               | [![npm version](https://badge.fury.io/js/%40common-utilities%2Frepeat.svg)](https://badge.fury.io/js/%40common-utilities%2Frepeat) | recursively replaces a value based on a certain length                                        |
| [Filter Array](/packages/filter-array)                   | [![npm version](https://badge.fury.io/js/%40common-utilities%2Ffilter-array.svg)](https://badge.fury.io/js/%40common-utilities%2Ffilter-array) | removes duplicates from an array                                                              |
| [Is Object](/packages/is-object)                         | [![npm version](https://badge.fury.io/js/%40common-utilities%2Fis-object.svg)](https://badge.fury.io/js/%40common-utilities%2is-object) | determines if data is of object type                                                          |
| [Merge Objects](/packages/merge-objects)                 | [![npm version](https://badge.fury.io/js/%40common-utilities%2Fmerge-objects.svg)](https://badge.fury.io/js/%40common-utilities%2merge-objects) | deeply merges 2 objects                                                                       |
| [String Interpolation](/packages/string-interpolation)   | [![npm version](https://badge.fury.io/js/%40common-utilities%2Fstring-interpolation.svg)](https://badge.fury.io/js/%40common-utilities%2Fstring-interpolation) | interpolating variables in strings                                                            |
| [Kebab To Camel String](/packages/kebab-to-camel-string) | [![npm version](https://badge.fury.io/js/%40common-utilities%2Fkebab-to-camel-string.svg)](https://badge.fury.io/js/%40common-utilities%2Fkebab-to-camel-string) | returns a kebab string as a camel string                                                      |
| [Trim Whitespace](/packages/trim-whitespace)             | [![npm version](https://badge.fury.io/js/%40common-utilities%2Ftrim-whitespace.svg)](https://badge.fury.io/js/%40common-utilities%2Ftrim-whitespace) | returns a string with trimmed whitespace                                                      |
| [Wait Until Defined](/packages/wait-until-defined)       | [![npm version](https://badge.fury.io/js/%40common-utilities%2Fwait-until-defined.svg)](https://badge.fury.io/js/%40common-utilities%2Fwait-until-defined) | waits and checks for a callback function to returns true                                      |
| [Debounce](/packages/debounce)       | [![npm version](https://badge.fury.io/js/%40common-utilities%2Fdebounce.svg)](https://badge.fury.io/js/%40common-utilities%2Fdebounce) | waits a set amount of time before invoking a callback                                      |

---

## Glossary

Below are sectioned descriptions and code usages of each implemented Common Utility. Read more about each common utility within each package's README!

[Compose](#compose-) | [Head](#head-) | [Pipe](#pipe-) | [Trace](#trace-) | [Repeat](#repeat-) | [Filter-Array](#filter-array-) | [Is-Object](#is-object-) | [Merge-Objects](#merge-objects-) | [String-interpolation](#string-interpolation-) | [Kebab-to-camel-string](#kebab-to-camel-string-) | [Trim-whitespace](#trim-whitespace-) | [Wait-until-defined](#wait-until-defined-) |

---

### Compose 🚂

**[Compose](/packages/compose)** is a common function that take the output from one function and automatically patches it to the input of the next function until it spits out the final value.

Compose is useful for computing a series of functions in a composed fashion improving code readability and testability.

#### Usage

```typescript
const result = compose(add1, subtract3, multipleBy5)
// result(3) // 5 (3 + 1 - 3 * 5)
```

---

### Head 👤

**[Head](/packages/head)** is a common function for return the value of the first item in an Array.

#### Usage

```typescript
head([0, 1, 2, 3, 4]) // 01
```

---

### Pipe ⛓

**[Pipe](/packages/pipe)** is a common function that take the output from one function and automatically patches it to the input of the next function until it spits out the final value in the opposite order of Compose.

Like compose, Pipe is useful for computing a series of functions in a composed fashion improving code readability and testability but in the opposite order of Compose.

#### Usage

```typescript
const result = pipe(add1, subtract2, multipleBy3)
// result(3) // 8 (3 * 3 - 2 + 1)
```

---

### Repeat 🖋

**[Repeat](/packages/repeat)** is a common function composed of function arguments which recursively invoke a callback function based on iterations returning a final value.

Repeat is useful for declaritively performing a while loop, making it more testable.

#### Usage

```typescript
const add1 = (val) => val + 1
repeat(100)(add1)(0) // 100
```

---

### Filter-Array 🧹

**[Filter Array](/packages/filter-array)** is a common function a common function that removes deplicate items from an array.

Filter is useful for ensuring an array is exact.

#### Usage

```typescript
filterArray(['test', 'test', 'foo', 'bar', 'biz']) // ['test', 'foo', 'bar', 'biz'])
```

---

### Is-Object 🎛

**[IsObject](/packages/is-object)** is a common function for knowings whether data is of Object type.
This function comes with `isArray` and `isOfObjectTypes` helper methods.

Is object is useful for determining that an object is an object **and** not an array.

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

#### Usage

```typescript
mergeObjects({ foo: 'bar' }, { baz: 'biz' }) // { foo: 'bar', baz: 'biz' }
```

### String-interpolation 🧵

**[String Interpolation](/packages/string-interpolation)** is a common function for interpolating variables in strings.

String Interpolation is useful for adding dynamic data to strings.

#### Usage

```typescript
stringInterpolation('This string has #{dynamicData}', [{ dynamicData: 'a knot in it' }])
// => 'This string has a knot in i
```

### Kebab-to-camel-string 🍢🐫

**[Kebab to Camel String](/packages/kebab-to-camel-string)** is a common function for returning a kebab string as a camel string.

Kebab to Camel String is useful for switching objects from kebab case to camel case which is more usable in JavaScript.

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

### Trim-whitespace ⬜️

**[Trim Whitespace](/packages/trim-whitespace)** is a common function for returning a string with trimmed text.

Trim-whitespace is useful for removing extra spaces from inputed strings.

#### Usage

```typescript
trimWhitespace('    This is some  really crazy.     string.   ')
// This is some really crazy. string.
```

---

### Wait-until-defined ⌚️

**[Wait-until-defined](/packages/wait-until-defined)** is a common function for waiting until data is defined via a callback which returns a boolean.

Wait-until-defined is useful for waiting until some data type is defined.

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

### Debounce 🏓

**[Debounce](/packages/bedounce)** is a common function that waits a set amount of time before invoking a callback.

Debounce is useful for ensuring that a function invocation doesn't happen too frequently.

#### Usage

```javascript
let result = 1
const add1 = (val) => {
  result = val + 1
}
debounce(add1, 1000)(1) // returns 2, after 1 second
```

---

## Comparison

If you're still undecided on Common Utilites here a few lines of comparison text to take you over the edge. 

### Common Utilities 🧰 &nbsp; or 1-line-of-code

Common Utilities provides an option to [1LOC](https://1loc.dev/) because each function can be imported rather than copied. This ensures that you don't need to write your own tests while knowing you're using easy to read tested code!

---

### Common Utilities 🧰 &nbsp; or Utilities Libraries

Common Utilities provides an option focused on simplicity compared to [Ramba](https://ramdajs.com/) or [Lodash](https://lodash.com/) because it provides solutions to many common JavaScript utility functions in a basic way. 

Where Ramba and Lodash provides better overall coverage for what each JavaScript utility does, they also are more challenging to quickly know if the code does what **you** need it to do. 

Also, Libraries like [Ramda](https://ramdajs.com/#usage) and [Lodash](https://lodash.com/per-method-packages) may assume that you [tree shake](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) unused code in your build pipeline and are generally more bytes of code.

---

## Cites

Many/all of these Common Utilities are written very well elsewhere.

See [1LOC](https://1loc.dev/), [LoDash](https://lodash.com/), and [Ramda](https://ramdajs.com/docs/) for a great start!

# @common-utilities/merge-objects 🧰👯‍♂️

![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)
[![npm version](https://badge.fury.io/js/%40common-utilities%2Fmerge-objects.svg)](https://badge.fury.io/js/%40common-utilities%2merge-objects)

**MergeObjects** is a common function for merging two objects deeply.

---

## Install

```bash
yarn add @common-utilities/merge-objects -D
```

## Function

JavaScript

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

TypeScript

```typescript
const mergeObjects = (item: Item, otherItem: Item): Item => {
  if ((!isObject(item) && !isArray(item)) || (!isObject(otherItem) && !isArray(otherItem))) {
    return item
  }
  if (isArray(item) && isArray(otherItem)) {
    return filterArray([...(item as Array<Item>), ...(otherItem as Array<Item>)])
  }

  return filterArray([...Object.keys(item), ...Object.keys(otherItem)]).reduce(
    (acc: Record<string, unknown>, key: string) => {
      if (typeof acc[key] === 'undefined') {
        acc[key] = otherItem[key]
      } else if (isObject(acc[key]) || isArray(acc[key])) {
        acc[key] = mergeObjects(item[key], otherItem[key])
      } else if (acc[key] !== otherItem[key] && typeof otherItem[key] !== 'undefined') {
        acc[key] = otherItem[key]
      }
      return acc
    },
    item,
  )
}
```

## Usage

```typescript
mergeObjects({ foo: 'bar' }, { baz: 'biz' })
// => { foo 'bar', baz: 'biz' }
```

---

## Common Utilities 🧰

**No cruft. No bloat. No dependencies.**

Simple, typed, functional, documented, and tested javascript utility functions.

---

View other [common utilities](https://github.com/yowainwright/common-utilities).

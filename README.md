# [Common Utilities](https://yowainwright.gitbook.io/common-utilities/) 🧰

#### No cruft. No bloat. No dependencies.

Simple, typed, functional, documented, and tested utility functions for JavaScript, TypeScript, Python, Go, and Rust.

[~View the docs](https://yowainwright.gitbook.io/common-utilities/)

---

## Project Structure

This monorepo contains utilities implemented in multiple languages. Each utility is organized as:

```
utilities/
├── [utility-name]/
│   ├── ts/      # TypeScript implementation
│   ├── py/      # Python implementation
│   ├── go/      # Go implementation
│   └── rust/    # Rust implementation
```

## Utilities

Listed below are currently available utilities. More are on the way!

<!--Packages Start-->

<!--Packages Stop--->

---

## Up Next

Here are 10 less common but useful utilities planned for implementation:

1. **memoize** - Cache function results for expensive computations
2. **chunk** - Split arrays into smaller arrays of specified size
3. **clamp** - Constrain a number between minimum and maximum values
4. **retry** - Retry failed operations with exponential backoff
5. **partition** - Split an array into two based on a predicate function
6. **zip** - Combine multiple arrays into tuples
7. **flatten** - Recursively flatten nested arrays to specified depth
8. **pick** - Create object with only specified properties
9. **omit** - Create object excluding specified properties
10. **sleep** - Promise-based delay utility for async operations

Each utility will be implemented in TypeScript, Python, Go, and Rust following the same patterns as existing utilities.

---

License, [MIT](./LICENSE)

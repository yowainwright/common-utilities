# Common Utilities

Small, typed TS utilities you can copy w/o adding a JS dep.

[in progress] Common Utilities uses an MCP-first, copy/paste workflow inspired by [shadcn/ui](https://ui.shadcn.com/docs).

1. ask for what you need
1. review the result
1. you own the source

## Why use it?

- **Fewer security concerns:** the copied utility requires no pkg install or dep tree.
- **Fewer tokens:** the MCP returns the focused utility, documentation, tests, diff, and provenance you need.
  You can just use the api as well. The MCP is lang translation only.
- **Fast development:** reuse small, tested building blocks instead of reinventing them.

## Use the MCP

Ask your MCP client for a TypeScript utility. The response includes:

- ready-to-copy source
- a Markdown explanation and usage example
- a reviewable diff
- tests and provenance

Review the diff, then copy the files into your project. Your codebase owns the result and future changes are explicit.

## Str (Strings)

String conversion, encoding, interpolation, and whitespace helpers.

### [kebab-to-camel-string](./u/str/kebab-to-camel-string/ts/README.md)

```ts
kebabToCamelString(value: string): string;
kebabToCamelStringsInObject(
  value: ObjectOfStrings,
): ObjectOfStrings;
```

Converts kebab-case text to camelCase. The object helper converts keys and preserves string values.

#### Usage

```ts
kebabToCamelString("test-thing");
// "testThing"

kebabToCamelStringsInObject({ "test-thing": "foo" });
// { testThing: "foo" }
```

#### Install notes

```sh
# Copy src/index.ts into your project.
# Dependencies: none.
```

#### Cites

- [Source](./u/str/kebab-to-camel-string/ts/src/index.ts)
- [Tests](./u/str/kebab-to-camel-string/ts/src/index.test.ts)

### [rot13](./u/str/rot13/ts/README.md): `(value: string) => string`

Applies the ROT13 substitution to ASCII letters and leaves other characters unchanged.

#### Usage

```ts
rot13("Hello Rot13 is awesome!");
// "Uryyb Ebg13 vf njrfbzr!"
```

#### Install notes

```sh
# Copy src/index.ts into your project.
# Dependencies: none.
```

#### Cites

- [Source](./u/str/rot13/ts/src/index.ts)
- [Tests](./u/str/rot13/ts/src/index.test.ts)

### [snake-to-camel-case](./u/str/snake-to-camel-case/ts/README.md): `(value: string) => string`

Converts a snake_case string to camelCase.

#### Usage

```ts
snakeToCamelCase("camel_case_string");
// "camelCaseString"
```

#### Install notes

```sh
# Copy src/index.ts into your project.
# Dependencies: none.
```

#### Cites

- [Source](./u/str/snake-to-camel-case/ts/src/index.ts)
- [Tests](./u/str/snake-to-camel-case/ts/src/index.test.ts)

### [string-interpolation](./u/str/string-interpolation/ts/README.md)

```ts
stringInterpolation(
  value: string,
  replacements: KeyValueStringsObject[],
): string;
```

Replaces `#{key}` placeholders with values from a list of string records.

#### Usage

```ts
stringInterpolation("This string has #{dynamicData}", [
  { dynamicData: "a knot in it" },
]);
// "This string has a knot in it"
```

#### Install notes

```sh
# Copy src/index.ts into your project.
# Dependencies: none.
```

#### Cites

- [Source](./u/str/string-interpolation/ts/src/index.ts)
- [Tests](./u/str/string-interpolation/ts/src/index.test.ts)

### [trim-whitespace](./u/str/trim-whitespace/ts/README.md): `(value: string) => string`

Trims outer whitespace and collapses repeated spaces into single spaces.

#### Usage

```ts
removeWhitespaceFromString("  This   has whitespace.  ");
// "This has whitespace."
```

#### Install notes

```sh
# Copy src/index.ts into your project.
# Dependencies: none.
```

#### Cites

- [Source](./u/str/trim-whitespace/ts/src/index.ts)
- [Tests](./u/str/trim-whitespace/ts/src/index.test.ts)

## Arr (Arrays)

Small array selection and deduplication helpers.

### [filter-array](./u/arr/filter-array/ts/README.md): `(value: unknown[]) => unknown[]`

Removes duplicate array items using strict equality. Object values are not deeply compared.

#### Usage

```ts
filterArray(["test", "test", "foo"]);
// ["test", "foo"]
```

#### Install notes

```sh
# Copy src/index.ts into your project.
# Dependencies: none.
```

#### Cites

- [Source](./u/arr/filter-array/ts/src/index.ts)
- [Tests](./u/arr/filter-array/ts/src/index.test.ts)

### [head](./u/arr/head/ts/README.md): `(value: unknown[]) => unknown`

Returns the first item in an array, or `undefined` for an empty array.

#### Usage

```ts
head(["first", "second"]);
// "first"
```

#### Install notes

```sh
# Copy src/index.ts into your project.
# Dependencies: none.
```

#### Cites

- [Source](./u/arr/head/ts/src/index.ts)
- [Tests](./u/arr/head/ts/src/index.test.ts)

## Obj (Objects)

Object checks and recursive merge helpers.

### [is-object](./u/obj/is-object/ts/README.md)

```ts
isArray(value: unknown): boolean;
isOfObjectType(value: unknown): boolean;
isObject(value: unknown): boolean;
```

Checks whether a value is an array, any non-null object-like value, or a non-array object.

#### Usage

```ts
isArray(["value"]); // true
isOfObjectType({ value: true }); // true
isObject(["value"]); // false
isObject({ value: true }); // true
```

#### Install notes

```sh
# Copy src/index.ts into your project.
# Dependencies: none.
```

#### Cites

- [Source](./u/obj/is-object/ts/src/index.ts)
- [Tests](./u/obj/is-object/ts/src/index.test.ts)

### [merge-objects](./u/obj/merge-objects/ts/README.md): `(left: unknown, right: unknown) => unknown`

Recursively merges objects and combines arrays while removing duplicate primitive values. Prototype-pollution keys are ignored during nested merges.

#### Usage

```ts
mergeObjects(
  { settings: { darkMode: false } },
  { settings: { compact: true } },
);
// { settings: { darkMode: false, compact: true } }
```

#### Install notes

```sh
# Copy src/index.ts into your project.
# Dependencies: none.
```

#### Cites

- [Source](./u/obj/merge-objects/ts/src/index.ts)
- [Tests](./u/obj/merge-objects/ts/src/index.test.ts)

## Fn (Functions)

Small composable function helpers.

### [compose](./u/fn/compose/ts/README.md): `<T>(...fns: ((value: T) => T)[]) => (value: T) => T`

Composes functions from right to left.

#### Usage

```ts
const add = (value: number) => value + 1;
const multiply = (value: number) => value * 2;

compose(add, multiply)(2);
// 5
```

#### Install notes

```sh
# Copy src/index.ts into your project.
# Dependencies: none.
```

#### Cites

- [Source](./u/fn/compose/ts/src/index.ts)
- [Tests](./u/fn/compose/ts/src/index.test.ts)

### [curry](./u/fn/curry/ts/README.md)

```ts
curry(fn: F.Function): (this: unknown, ...args: Parameters<typeof fn>) => any;
```

Returns a function that can receive a function's arguments over multiple calls.

#### Usage

```ts
const add = (a: number, b: number, c: number) => a + b + c;

curry(add)(1, 2)(3);
// 6
```

#### Install notes

```sh
# Copy src/index.ts into your project.
# Type dependency: ts-toolbelt.
# Keep ts-toolbelt for the current F.Function type import.
```

#### Cites

- [Source](./u/fn/curry/ts/src/index.ts)
- [Tests](./u/fn/curry/ts/src/index.test.ts)

### [pipe](./u/fn/pipe/ts/README.md): `<T>(...fns: ((value: T) => T)[]) => (value: T) => T`

Composes functions from left to right.

#### Usage

```ts
const multiply = (value: number) => value * 2;
const add = (value: number) => value + 1;

pipe(multiply, add)(2);
// 5
```

#### Install notes

```sh
# Copy src/index.ts into your project.
# Dependencies: none.
```

#### Cites

- [Source](./u/fn/pipe/ts/src/index.ts)
- [Tests](./u/fn/pipe/ts/src/index.test.ts)

### [repeat](./u/fn/repeat/ts/README.md): `(iterations: number) => <T>(fn: (value: T) => T) => (value: T) => T`

Runs a callback a fixed number of times and returns the final value.

#### Usage

```ts
repeat(3)((value: number) => value + 1)(0);
// 3
```

#### Install notes

```sh
# Copy src/index.ts into your project.
# Dependencies: none.
```

#### Cites

- [Source](./u/fn/repeat/ts/src/index.ts)
- [Tests](./u/fn/repeat/ts/src/index.test.ts)

## Rx (Reactivity)

Timing and readiness helpers. `wait-until-defined` is deprecated for new code.

### [debounce](./u/rx/debounce/ts/README.md): `<T>(fn: (value?: T) => void, delay: number) => (value?: T) => void`

Delays a callback until calls stop arriving during the delay window.

#### Usage

```ts
const save = debounce((value?: string) => {
  console.log(value);
}, 300);

save("latest value");
```

#### Install notes

```sh
# Copy src/index.ts into your project.
# Dependencies: none.
```

#### Cites

- [Source](./u/rx/debounce/ts/src/index.ts)
- [Tests](./u/rx/debounce/ts/src/index.test.ts)

### [throttle](./u/rx/throttle/ts/README.md): `<T>(fn: (value?: T) => void, delay: number) => (value?: T) => null | number`

Schedules the first callback in a delay window and ignores later calls while that timeout is active.

#### Usage

```ts
const report = throttle((value?: number) => {
  console.log(value);
}, 300);

report(1);
report(2);
```

#### Install notes

```sh
# Copy src/index.ts into your project.
# Dependencies: none.
```

#### Cites

- [Source](./u/rx/throttle/ts/src/index.ts)
- [Tests](./u/rx/throttle/ts/src/index.test.ts)

### [wait-until-defined](./u/rx/wait-until-defined/ts/README.md)

```ts
wait(timeout: number): Promise<true>;
isDefined(check: () => boolean): Promise<boolean>;
checkDefinition(
  check: () => boolean,
  interval: number,
  attempts: number,
): Promise<boolean>;
waitUntilDefined(
  check: () => boolean,
  interval?: number,
  timeout?: number,
): Promise<boolean>;
```

Polls a callback until it returns `true` or the timeout expires. Deprecated: prefer the event or readiness signal that makes the value available.

#### Usage

```ts
await waitUntilDefined(() => ready, 100, 5000);
```

#### Install notes

```sh
# Deprecated: do not add this to new code.
# Dependencies: none.
```

#### Cites

- [Source](./u/rx/wait-until-defined/ts/src/index.ts)
- [Tests](./u/rx/wait-until-defined/ts/src/index.test.ts)

## Obx (Observability)

Small helpers for observing values without changing the value flow.

### [trace](./u/obx/trace/ts/README.md): `(label: string) => (value: unknown) => unknown`

Logs a label and value, then returns the original value for use in a pipeline.

#### Usage

```ts
const result = trace("number")(2);
// logs: number: 2
// result: 2
```

#### Install notes

```sh
# Copy src/index.ts into your project.
# Dependencies: none.
```

#### Cites

- [Source](./u/obx/trace/ts/src/index.ts)
- [Tests](./u/obx/trace/ts/src/index.test.ts)

## Doc (Documents)

Helpers for turning package metadata into Markdown.

### [update-markdown-list](./u/doc/update-markdown-list/ts/README.md)

```ts
logger(options: LoggerOptions): {
  debug(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
};
processPackages(
  packagesDirectory: string,
  markdownFile: string,
  jsonFile: string,
  isLogging?: boolean,
): void;
getJsonData(
  packagePath: string,
  jsonFile: string,
  log: ReturnType<typeof logger>,
): string;
updateText(
  markdownFile: string,
  jsonFile: string,
  log: ReturnType<typeof logger>,
  packagesDirectory: string,
  packageName: string,
): void;
updateMd(
  markdownText: string,
  markdownFile: string,
  log: ReturnType<typeof logger>,
): void;
```

Reads package metadata and appends formatted package headings and descriptions to a Markdown file.

#### Usage

```ts
const log = logger({ file: "README.md" });

const description = getJsonData("./packages/example", "package.json", log);
updateMd(description, "./README.md", log);
```

#### Install notes

```sh
# Copy src/index.ts into your project.
# Uses Node.js built-ins only.
```

#### Cites

- [Source](./u/doc/update-markdown-list/ts/src/index.ts)
- [Tests](./u/doc/update-markdown-list/ts/src/index.test.ts)

Browse the [full documentation](https://yowainwright.gitbook.io/common-utilities/) for more examples.

## License

[MIT](./LICENSE)

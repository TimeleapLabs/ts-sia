# Sia for TypeScript

![Build Status](https://github.com/TimeleapLabs/ts-sia/actions/workflows/push-checks.yml/badge.svg?branch=master)
[![npm](https://img.shields.io/npm/v/@timeleap/sia)](https://www.npmjs.com/package/@timeleap/sia)

TypeScript/JavaScript implementation of the [Sia](https://github.com/TimeleapLabs/sia) binary serialization library. Fast, compact, zero dependencies.

**[Documentation](https://sia.timeleap.swiss/docs?lang=ts)**

## Installation

```bash
npm install @timeleap/sia
# or
yarn add @timeleap/sia
# or
pnpm add @timeleap/sia
```

## Quick Example

```ts
import { Sia } from "@timeleap/sia";

const sia = new Sia();
sia.addString8("Alice").addUInt8(30).addBool(true);

sia.seek(0);
console.log(sia.readString8()); // "Alice"
console.log(sia.readUInt8()); // 30
console.log(sia.readBool()); // true
```

All `add*` methods return `this`, so calls can be chained. After writing, `seek(0)` resets the offset for reading.

## Functional API

Every operation is also exported as a standalone function for tree-shaking. If you import functions directly instead of the `Sia` class, your bundler can drop everything you don't use:

```ts
import {
  Buffer,
  addString8,
  readString8,
  addUInt8,
  readUInt8,
} from "@timeleap/sia";

const buf = Buffer.alloc(256);
addString8(buf, "Alice");
addUInt8(buf, 30);

buf.seek(0);
console.log(readString8(buf)); // "Alice"
console.log(readUInt8(buf)); // 30
```

See the [tree-shaking guide](https://sia.timeleap.swiss/docs/guides/tree-shaking?lang=ts) for the full list of available functions.

## Supported Types

| Type                       | Write                                 | Read                                    |
| -------------------------- | ------------------------------------- | --------------------------------------- |
| Integers (8/16/32/64)      | `addUInt8`, `addInt32`, ...           | `readUInt8`, `readInt32`, ...           |
| Strings (8/16/32/64)       | `addString8`, `addString32`, ...      | `readString8`, `readString32`, ...      |
| Byte arrays (N/8/16/32/64) | `addByteArrayN`, `addByteArray8`, ... | `readByteArrayN`, `readByteArray8`, ... |
| Typed arrays (8/16/32/64)  | `addArray8`, `addArray32`, ...        | `readArray8`, `readArray32`, ...        |
| Boolean                    | `addBool`                             | `readBool`                              |
| BigInt                     | `addBigInt`                           | `readBigInt`                            |
| ASCII (N/8/16/32/64)       | `addAscii8`, `addAsciiN`, ...         | `readAscii8`, `readAsciiN`, ...         |
| UTFZ                       | `addUtfz`                             | `readUtfz`                              |
| Embed                      | `embedSia`, `embedBytes`              | -                                       |

The number suffix indicates the byte width of the length prefix. `N` variants take an explicit length with no prefix.

## Schema Compiler

Instead of writing serialization code by hand, you can define types in `.sia` files and generate TypeScript code:

```
schema User {
  name    string8
  age     uint8
  active  bool
}
```

```bash
npx @timeleap/sia-schema compile user.sia -o user.ts
```

See [sia-schema](https://github.com/TimeleapLabs/sia-schema) for details.

## Other Languages

Sia has native implementations with the same wire format:

| Language | Repo                                               | Package                             |
| -------- | -------------------------------------------------- | ----------------------------------- |
| Go       | [go-sia](https://github.com/TimeleapLabs/go-sia)   | `github.com/TimeleapLabs/go-sia/v2` |
| Python   | [py-sia](https://github.com/TimeleapLabs/py-sia)   | `timeleap-sia`                      |
| C++      | [cpp-sia](https://github.com/TimeleapLabs/cpp-sia) | CMake                               |

Serialize in TypeScript, deserialize in Go (or any other combination). The wire format is identical across all implementations.

## License

ISC

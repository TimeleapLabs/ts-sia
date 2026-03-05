# Tree-Shakeable Sia Design

## Problem

Sia uses a monolithic class with 50+ methods. Bundlers cannot tree-shake class methods, so consumers bundle the entire library even when using a subset of types.

## Goals

- Unused type serializers (e.g. strings, arrays) are eliminated from bundles when not imported
- Read-only or write-only usage eliminates the unused direction
- Existing class-based API remains fully backward compatible

## Design

### File Structure

```
src/
├── index.ts          # Re-exports everything: Sia class + all standalone functions
├── buffer.ts         # Buffer base class with alloc/allocUnsafe
├── sia.ts            # Slim Sia class wrapping standalone functions (backward compat)
├── ascii.ts          # ASCII utilities (unchanged)
├── integers.ts       # addUInt8/readUInt8 through addInt64/readInt64
├── strings.ts        # addUtfz/readUtfz, addAsciiN/readAsciiN, addString8/readString8, etc.
├── byteArrays.ts     # addByteArrayN/readByteArrayN through addByteArray64/readByteArray64
├── arrays.ts         # addArray8/readArray8 through addArray64/readArray64
├── bool.ts           # addBool/readBool
├── bigint.ts         # addBigInt/readBigInt
└── embed.ts          # embedSia/embedBytes
```

### Buffer Changes

- `alloc(size)` and `allocUnsafe(size)` move from Sia to Buffer
- Global shared buffer moves to `buffer.ts`
- `Buffer.new()` is removed (unused)
- Buffer is the only dependency for standalone functions

### Standalone Functions

All operate on `Buffer` (not `Sia`), return `Buffer` for chaining on write methods:

```ts
// integers.ts
export function addUInt8(buf: Buffer, n: number): Buffer;
export function readUInt8(buf: Buffer): number;

// strings.ts
export function addString8(buf: Buffer, str: string): Buffer;
export function readString8(buf: Buffer): string;

// byteArrays.ts
export function addByteArray8(buf: Buffer, bytes: Uint8Array): Buffer;
export function readByteArray8(buf: Buffer, asReference?: boolean): Uint8Array;

// arrays.ts
export function addArray8<T>(buf: Buffer, arr: T[], fn: (b: Buffer, item: T) => void): Buffer;
export function readArray8<T>(buf: Buffer, fn: (b: Buffer) => T): T[];
```

`TextEncoder`/`TextDecoder` become module-level singletons in `strings.ts`.

### Sia Class (Backward Compat)

Thin wrapper that delegates every method to the corresponding standalone function:

```ts
class Sia extends Buffer {
  addUInt8(n: number): Sia { return addUInt8(this, n) as Sia; }
  readUInt8(): number { return readUInt8(this); }
  // ...etc
}
```

Importing `Sia` pulls in everything (not tree-shakeable). Importing standalone functions only pulls in what's used.

### Exports

`index.ts` uses named re-exports for full tree-shaking support:

```ts
export { Buffer } from "./buffer.js";
export { Sia } from "./sia.js";
export { addUInt8, readUInt8, ... } from "./integers.js";
export { addString8, readString8, ... } from "./strings.js";
// ...etc
```

### Usage

**Existing (unchanged):**
```ts
import { Sia } from "@timeleap/sia";
const sia = Sia.alloc(1024);
sia.addUInt8(42).addString8("hello");
```

**Tree-shakeable:**
```ts
import { Buffer, addUInt8, readUInt8 } from "@timeleap/sia";
const buf = Buffer.alloc(1024);
addUInt8(buf, 42);
```

### Testing

- Existing `tests/sia.test.ts` unchanged (backward compat verification)
- New `tests/functions.test.ts` tests standalone functions against `Buffer` directly

### Benchmarks

- Add a benchmark case using `Buffer` + standalone functions alongside existing Sia class benchmark to verify no performance regression from the indirection

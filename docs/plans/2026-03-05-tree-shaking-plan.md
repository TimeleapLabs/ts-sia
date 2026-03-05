# Tree-Shakeable Sia Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make Sia tree-shakeable by extracting all methods into standalone functions that operate on Buffer, while keeping the Sia class as a backward-compatible wrapper.

**Architecture:** Standalone functions in category-based modules (`integers.ts`, `strings.ts`, etc.) all operate on `Buffer`. The `Sia` class becomes a thin wrapper that delegates to these functions. All functions are re-exported from `index.ts` as named exports for tree-shaking.

**Tech Stack:** TypeScript, ESM, Jest

---

### Task 1: Update Buffer class

**Files:**
- Modify: `src/buffer.ts`

**Step 1: Add alloc, allocUnsafe, and global shared buffer to Buffer**

Move the global shared buffer and allocation methods from Sia to Buffer. Remove `static new()`. Buffer's `seek` and `skip` should return `this` for chaining.

```typescript
const GLOBAL_SHARED_UNSAFE_BUFFER = {
  buffer: new Uint8Array(32 * 1024 * 1024),
  offset: 0,
};

export class Buffer {
  public size: number;
  public content: Uint8Array;
  public offset: number;
  public dataView: DataView;

  constructor(uint8Array: Uint8Array) {
    this.size = uint8Array.length;
    this.content = uint8Array;
    this.offset = 0;
    this.dataView = new DataView(
      uint8Array.buffer,
      uint8Array.byteOffset,
      uint8Array.byteLength,
    );
  }

  static alloc(size: number): Buffer {
    return new Buffer(new Uint8Array(size));
  }

  static allocUnsafe(size: number): Buffer {
    const begin =
      GLOBAL_SHARED_UNSAFE_BUFFER.offset + size >
      GLOBAL_SHARED_UNSAFE_BUFFER.buffer.length
        ? 0
        : GLOBAL_SHARED_UNSAFE_BUFFER.offset;

    const subarray = GLOBAL_SHARED_UNSAFE_BUFFER.buffer.subarray(
      begin,
      begin + size,
    );

    GLOBAL_SHARED_UNSAFE_BUFFER.offset = begin + size;
    return new Buffer(subarray);
  }

  seek(offset: number): this {
    this.offset = offset;
    return this;
  }

  skip(count: number): this {
    this.offset += count;
    return this;
  }

  setContent(uint8Array: Uint8Array): this {
    this.size = uint8Array.length;
    this.content = uint8Array;
    this.offset = 0;
    this.dataView = new DataView(
      uint8Array.buffer,
      uint8Array.byteOffset,
      uint8Array.byteLength,
    );
    return this;
  }

  add(data: Uint8Array) {
    if (this.offset + data.length > this.size) {
      throw new Error("Buffer overflow");
    }
    this.content.set(data, this.offset);
    this.offset += data.length;
  }

  addOne(data: number) {
    if (this.offset + 1 > this.size) {
      throw new Error("Buffer overflow");
    }
    this.content[this.offset] = data;
    this.offset++;
  }

  toUint8Array() {
    return this.content.slice(0, this.offset);
  }

  toUint8ArrayReference() {
    return this.content.subarray(0, this.offset);
  }

  slice(start: number, end: number) {
    return this.content.slice(start, end);
  }

  get(offset: number) {
    return this.content[offset];
  }

  get length() {
    return this.size;
  }
}
```

Key changes from original:
- Added `alloc()` and `allocUnsafe()` static methods (moved from Sia)
- Added `setContent()` (moved from Sia)
- Removed `static new()`
- `seek()`, `skip()`, `setContent()` now return `this` for chaining
- Added global shared buffer at module level

**Step 2: Run existing tests to check nothing breaks yet**

Run: `npx jest --passWithNoTests`
Expected: Tests may fail since Sia hasn't been updated yet — that's OK, we'll fix it in later tasks.

**Step 3: Commit**

```bash
git add src/buffer.ts
git commit -m "refactor: add alloc/allocUnsafe to Buffer, return this for chaining"
```

---

### Task 2: Create integers.ts

**Files:**
- Create: `src/integers.ts`

**Step 1: Write the standalone integer functions**

All functions use `<B extends Buffer>` generic so they return the correct type when called on Buffer or Sia subclass.

```typescript
import { Buffer } from "./buffer.js";

export function addUInt8<B extends Buffer>(buf: B, n: number): B {
  buf.addOne(n);
  return buf;
}

export function readUInt8(buf: Buffer): number {
  if (buf.offset >= buf.length) {
    throw new Error("Not enough data to read uint8");
  }
  return buf.get(buf.offset++);
}

export function addInt8<B extends Buffer>(buf: B, n: number): B {
  buf.addOne(n);
  return buf;
}

export function readInt8(buf: Buffer): number {
  if (buf.offset >= buf.size) {
    throw new Error("Not enough data to read int8");
  }
  const value = buf.dataView.getInt8(buf.offset);
  buf.offset++;
  return value;
}

export function addUInt16<B extends Buffer>(buf: B, n: number): B {
  buf.dataView.setUint16(buf.offset, n, true);
  buf.offset += 2;
  return buf;
}

export function readUInt16(buf: Buffer): number {
  if (buf.offset + 2 > buf.content.length) {
    throw new Error("Not enough data to read uint16");
  }
  const value = buf.dataView.getUint16(buf.offset, true);
  buf.offset += 2;
  return value;
}

export function addInt16<B extends Buffer>(buf: B, n: number): B {
  buf.dataView.setInt16(buf.offset, n, true);
  buf.offset += 2;
  return buf;
}

export function readInt16(buf: Buffer): number {
  if (buf.offset + 2 > buf.content.length) {
    throw new Error("Not enough data to read int16");
  }
  const value = buf.dataView.getInt16(buf.offset, true);
  buf.offset += 2;
  return value;
}

export function addUInt32<B extends Buffer>(buf: B, n: number): B {
  buf.dataView.setUint32(buf.offset, n, true);
  buf.offset += 4;
  return buf;
}

export function readUInt32(buf: Buffer): number {
  if (buf.offset + 4 > buf.content.length) {
    throw new Error("Not enough data to read uint32");
  }
  const value = buf.dataView.getUint32(buf.offset, true);
  buf.offset += 4;
  return value;
}

export function addInt32<B extends Buffer>(buf: B, n: number): B {
  buf.dataView.setInt32(buf.offset, n, true);
  buf.offset += 4;
  return buf;
}

export function readInt32(buf: Buffer): number {
  if (buf.offset + 4 > buf.content.length) {
    throw new Error("Not enough data to read int32");
  }
  const value = buf.dataView.getInt32(buf.offset, true);
  buf.offset += 4;
  return value;
}

export function addUInt64<B extends Buffer>(buf: B, n: number): B {
  buf.dataView.setUint32(buf.offset, n & 0xffffffff, true);
  buf.dataView.setUint32(buf.offset + 4, n / 0x100000000, true);
  buf.offset += 8;
  return buf;
}

export function readUInt64(buf: Buffer): number {
  if (buf.offset + 8 > buf.content.length) {
    throw new Error("Not enough data to read uint64");
  }
  const lower = buf.dataView.getUint32(buf.offset, true);
  const upper = buf.dataView.getUint32(buf.offset + 4, true);
  buf.offset += 8;
  return upper * 0x100000000 + lower;
}

export function addInt64<B extends Buffer>(buf: B, n: number): B {
  const lower = n & 0xffffffff;
  const upper = Math.floor(n / 0x100000000);
  buf.dataView.setUint32(buf.offset, lower >>> 0, true);
  buf.dataView.setInt32(buf.offset + 4, upper, true);
  buf.offset += 8;
  return buf;
}

export function readInt64(buf: Buffer): number {
  if (buf.offset + 8 > buf.content.length) {
    throw new Error("Not enough data to read int64");
  }
  const lower = buf.dataView.getUint32(buf.offset, true);
  const upper = buf.dataView.getInt32(buf.offset + 4, true);
  buf.offset += 8;
  return upper * 0x100000000 + lower;
}
```

**Step 2: Write tests for standalone integer functions**

Create `tests/integers.test.ts`:

```typescript
import { Buffer } from "../src/buffer.js";
import {
  addUInt8, readUInt8, addInt8, readInt8,
  addUInt16, readUInt16, addInt16, readInt16,
  addUInt32, readUInt32, addInt32, readInt32,
  addUInt64, readUInt64, addInt64, readInt64,
} from "../src/integers.js";

describe("Standalone integers", () => {
  describe("8-bit", () => {
    it("should add and read uint8", () => {
      const buf = Buffer.alloc(64);
      addUInt8(buf, 255);
      buf.seek(0);
      expect(readUInt8(buf)).toBe(255);
    });

    it("should add and read int8", () => {
      const buf = Buffer.alloc(64);
      addInt8(buf, -120);
      buf.seek(0);
      expect(readInt8(buf)).toBe(-120);
    });
  });

  describe("16-bit", () => {
    it("should add and read uint16", () => {
      const buf = Buffer.alloc(64);
      addUInt16(buf, 65535);
      buf.seek(0);
      expect(readUInt16(buf)).toBe(65535);
    });

    it("should add and read int16", () => {
      const buf = Buffer.alloc(64);
      addInt16(buf, -32768);
      buf.seek(0);
      expect(readInt16(buf)).toBe(-32768);
    });
  });

  describe("32-bit", () => {
    it("should add and read uint32", () => {
      const buf = Buffer.alloc(64);
      addUInt32(buf, 4294967295);
      buf.seek(0);
      expect(readUInt32(buf)).toBe(4294967295);
    });

    it("should add and read int32", () => {
      const buf = Buffer.alloc(64);
      addInt32(buf, -2147483648);
      buf.seek(0);
      expect(readInt32(buf)).toBe(-2147483648);
    });
  });

  describe("64-bit", () => {
    it("should add and read uint64", () => {
      const buf = Buffer.alloc(64);
      addUInt64(buf, Number.MAX_SAFE_INTEGER);
      buf.seek(0);
      expect(readUInt64(buf)).toBe(Number.MAX_SAFE_INTEGER);
    });

    it("should add and read int64", () => {
      const buf = Buffer.alloc(64);
      addInt64(buf, Number.MIN_SAFE_INTEGER);
      buf.seek(0);
      expect(readInt64(buf)).toBe(Number.MIN_SAFE_INTEGER);
    });
  });

  describe("error handling", () => {
    it("should throw on uint8 with insufficient data", () => {
      const buf = Buffer.alloc(1);
      buf.seek(1);
      expect(() => readUInt8(buf)).toThrow("Not enough data to read uint8");
    });

    it("should throw on int8 with insufficient data", () => {
      const buf = Buffer.alloc(1);
      buf.seek(1);
      expect(() => readInt8(buf)).toThrow("Not enough data to read int8");
    });

    it("should throw on uint16 with insufficient data", () => {
      const buf = Buffer.alloc(1);
      expect(() => readUInt16(buf)).toThrow("Not enough data to read uint16");
    });

    it("should throw on int16 with insufficient data", () => {
      const buf = Buffer.alloc(1);
      expect(() => readInt16(buf)).toThrow("Not enough data to read int16");
    });

    it("should throw on uint32 with insufficient data", () => {
      const buf = Buffer.alloc(3);
      expect(() => readUInt32(buf)).toThrow("Not enough data to read uint32");
    });

    it("should throw on int32 with insufficient data", () => {
      const buf = Buffer.alloc(3);
      expect(() => readInt32(buf)).toThrow("Not enough data to read int32");
    });

    it("should throw on uint64 with insufficient data", () => {
      const buf = Buffer.alloc(7);
      expect(() => readUInt64(buf)).toThrow("Not enough data to read uint64");
    });

    it("should throw on int64 with insufficient data", () => {
      const buf = Buffer.alloc(7);
      expect(() => readInt64(buf)).toThrow("Not enough data to read int64");
    });
  });
});
```

**Step 3: Run tests**

Run: `npx jest tests/integers.test.ts --verbose`
Expected: All pass.

**Step 4: Commit**

```bash
git add src/integers.ts tests/integers.test.ts
git commit -m "feat: add standalone integer functions with tests"
```

---

### Task 3: Create byteArrays.ts

**Files:**
- Create: `src/byteArrays.ts`

**Step 1: Write standalone byte array functions**

```typescript
import { Buffer } from "./buffer.js";
import { addUInt8, readUInt8, addUInt16, readUInt16, addUInt32, readUInt32, addUInt64, readUInt64 } from "./integers.js";

export function addByteArrayN<B extends Buffer>(buf: B, bytes: Uint8Array): B {
  buf.add(bytes);
  return buf;
}

export function readByteArrayN(buf: Buffer, length: number, asReference = false): Uint8Array {
  if (buf.offset + length > buf.content.length) {
    throw new Error("Not enough data to read byte array");
  }
  const bytes = asReference
    ? buf.content.subarray(buf.offset, buf.offset + length)
    : buf.content.slice(buf.offset, buf.offset + length);
  buf.offset += length;
  return bytes;
}

export function addByteArray8<B extends Buffer>(buf: B, bytes: Uint8Array): B {
  addUInt8(buf, bytes.length);
  addByteArrayN(buf, bytes);
  return buf;
}

export function readByteArray8(buf: Buffer, asReference = false): Uint8Array {
  const length = readUInt8(buf);
  return readByteArrayN(buf, length, asReference);
}

export function addByteArray16<B extends Buffer>(buf: B, bytes: Uint8Array): B {
  addUInt16(buf, bytes.length);
  addByteArrayN(buf, bytes);
  return buf;
}

export function readByteArray16(buf: Buffer, asReference = false): Uint8Array {
  const length = readUInt16(buf);
  return readByteArrayN(buf, length, asReference);
}

export function addByteArray32<B extends Buffer>(buf: B, bytes: Uint8Array): B {
  addUInt32(buf, bytes.length);
  addByteArrayN(buf, bytes);
  return buf;
}

export function readByteArray32(buf: Buffer, asReference = false): Uint8Array {
  const length = readUInt32(buf);
  return readByteArrayN(buf, length, asReference);
}

export function addByteArray64<B extends Buffer>(buf: B, bytes: Uint8Array): B {
  addUInt64(buf, bytes.length);
  addByteArrayN(buf, bytes);
  return buf;
}

export function readByteArray64(buf: Buffer, asReference = false): Uint8Array {
  const length = readUInt64(buf);
  return readByteArrayN(buf, length, asReference);
}
```

**Step 2: Write tests**

Create `tests/byteArrays.test.ts`:

```typescript
import { Buffer } from "../src/buffer.js";
import {
  addByteArrayN, readByteArrayN,
  addByteArray8, readByteArray8,
  addByteArray16, readByteArray16,
  addByteArray32, readByteArray32,
  addByteArray64, readByteArray64,
} from "../src/byteArrays.js";

describe("Standalone byteArrays", () => {
  it("should add and read ByteArray8", () => {
    const buf = Buffer.alloc(256);
    const bytes = new Uint8Array([1, 2, 3, 4, 5]);
    addByteArray8(buf, bytes);
    buf.seek(0);
    expect(readByteArray8(buf)).toEqual(bytes);
  });

  it("should add and read ByteArray16", () => {
    const buf = Buffer.alloc(256);
    const bytes = new Uint8Array([10, 20, 30, 40, 50]);
    addByteArray16(buf, bytes);
    buf.seek(0);
    expect(readByteArray16(buf)).toEqual(bytes);
  });

  it("should add and read ByteArray32", () => {
    const buf = Buffer.alloc(256);
    const bytes = new Uint8Array(100).map((_, i) => i);
    addByteArray32(buf, bytes);
    buf.seek(0);
    expect(readByteArray32(buf)).toEqual(bytes);
  });

  it("should add and read ByteArray64", () => {
    const buf = Buffer.alloc(256);
    const bytes = new Uint8Array(50).map((_, i) => (i * 2) % 256);
    addByteArray64(buf, bytes);
    buf.seek(0);
    expect(readByteArray64(buf)).toEqual(bytes);
  });

  it("should throw on insufficient data", () => {
    const buf = Buffer.alloc(3);
    expect(() => readByteArrayN(buf, 4)).toThrow("Not enough data to read byte array");
  });
});
```

**Step 3: Run tests**

Run: `npx jest tests/byteArrays.test.ts --verbose`
Expected: All pass.

**Step 4: Commit**

```bash
git add src/byteArrays.ts tests/byteArrays.test.ts
git commit -m "feat: add standalone byte array functions with tests"
```

---

### Task 4: Create strings.ts

**Files:**
- Create: `src/strings.ts`

**Step 1: Write standalone string functions**

```typescript
import { Buffer } from "./buffer.js";
import { pack, unpack } from "utfz-lib";
import { asciiToUint8Array, uint8ArrayToAscii } from "./ascii.js";
import { addUInt8, readUInt8, addUInt16, readUInt16, addUInt32, readUInt32, addUInt64, readUInt64 } from "./integers.js";
import { addByteArray8, readByteArray8, addByteArray16, readByteArray16, addByteArray32, readByteArray32, addByteArray64, readByteArray64 } from "./byteArrays.js";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function addUtfz<B extends Buffer>(buf: B, str: string): B {
  const lengthOffset = buf.offset++;
  const length = pack(str, str.length, buf.content, buf.offset);
  buf.content[lengthOffset] = length;
  buf.offset += length;
  return buf;
}

export function readUtfz(buf: Buffer): string {
  const length = readUInt8(buf);
  const str = unpack(buf.content, length, buf.offset);
  buf.offset += length;
  return str;
}

export function addAsciiN<B extends Buffer>(buf: B, str: string): B {
  buf.offset += asciiToUint8Array(str, str.length, buf.content, buf.offset);
  return buf;
}

export function readAsciiN(buf: Buffer, length: number): string {
  const str = uint8ArrayToAscii(buf.content, length, buf.offset);
  buf.offset += length;
  return str;
}

export function addAscii8<B extends Buffer>(buf: B, str: string): B {
  const length = str.length;
  addUInt8(buf, length);
  buf.offset += asciiToUint8Array(str, length, buf.content, buf.offset);
  return buf;
}

export function readAscii8(buf: Buffer): string {
  const length = readUInt8(buf);
  const str = uint8ArrayToAscii(buf.content, length, buf.offset);
  buf.offset += length;
  return str;
}

export function addAscii16<B extends Buffer>(buf: B, str: string): B {
  const length = str.length;
  addUInt16(buf, length);
  buf.offset += asciiToUint8Array(str, length, buf.content, buf.offset);
  return buf;
}

export function readAscii16(buf: Buffer): string {
  const length = readUInt16(buf);
  const str = uint8ArrayToAscii(buf.content, length, buf.offset);
  buf.offset += length;
  return str;
}

export function addAscii32<B extends Buffer>(buf: B, str: string): B {
  const length = str.length;
  addUInt32(buf, length);
  buf.offset += asciiToUint8Array(str, length, buf.content, buf.offset);
  return buf;
}

export function readAscii32(buf: Buffer): string {
  const length = readUInt32(buf);
  const str = uint8ArrayToAscii(buf.content, length, buf.offset);
  buf.offset += length;
  return str;
}

export function addAscii64<B extends Buffer>(buf: B, str: string): B {
  const length = str.length;
  addUInt64(buf, length);
  buf.offset += asciiToUint8Array(str, length, buf.content, buf.offset);
  return buf;
}

export function readAscii64(buf: Buffer): string {
  const length = readUInt64(buf);
  const str = uint8ArrayToAscii(buf.content, length, buf.offset);
  buf.offset += length;
  return str;
}

export function addString8<B extends Buffer>(buf: B, str: string): B {
  const encoded = encoder.encode(str);
  return addByteArray8(buf, encoded);
}

export function readString8(buf: Buffer): string {
  const bytes = readByteArray8(buf, true);
  return decoder.decode(bytes);
}

export function addString16<B extends Buffer>(buf: B, str: string): B {
  const encoded = encoder.encode(str);
  return addByteArray16(buf, encoded);
}

export function readString16(buf: Buffer): string {
  const bytes = readByteArray16(buf, true);
  return decoder.decode(bytes);
}

export function addString32<B extends Buffer>(buf: B, str: string): B {
  const encoded = encoder.encode(str);
  return addByteArray32(buf, encoded);
}

export function readString32(buf: Buffer): string {
  const bytes = readByteArray32(buf, true);
  return decoder.decode(bytes);
}

export function addString64<B extends Buffer>(buf: B, str: string): B {
  const encoded = encoder.encode(str);
  return addByteArray64(buf, encoded);
}

export function readString64(buf: Buffer): string {
  const bytes = readByteArray64(buf, true);
  return decoder.decode(bytes);
}
```

**Step 2: Write tests**

Create `tests/strings.test.ts`:

```typescript
import { Buffer } from "../src/buffer.js";
import {
  addUtfz, readUtfz,
  addAsciiN, readAsciiN, addAscii8, readAscii8,
  addAscii16, readAscii16, addAscii32, readAscii32, addAscii64, readAscii64,
  addString8, readString8, addString16, readString16,
  addString32, readString32, addString64, readString64,
} from "../src/strings.js";

describe("Standalone strings", () => {
  describe("UTFZ", () => {
    it("should add and read UTFZ string", () => {
      const buf = Buffer.alloc(256);
      addUtfz(buf, "Hello, UTFZ!");
      buf.seek(0);
      expect(readUtfz(buf)).toBe("Hello, UTFZ!");
    });
  });

  describe("ASCII", () => {
    const testString = "Hello, ASCII!";

    it("should add and read AsciiN", () => {
      const buf = Buffer.alloc(256);
      addAsciiN(buf, testString);
      buf.seek(0);
      expect(readAsciiN(buf, testString.length)).toBe(testString);
    });

    it("should add and read Ascii8", () => {
      const buf = Buffer.alloc(256);
      addAscii8(buf, testString);
      buf.seek(0);
      expect(readAscii8(buf)).toBe(testString);
    });

    it("should add and read Ascii16", () => {
      const buf = Buffer.alloc(256);
      addAscii16(buf, testString);
      buf.seek(0);
      expect(readAscii16(buf)).toBe(testString);
    });

    it("should add and read Ascii32", () => {
      const buf = Buffer.alloc(256);
      addAscii32(buf, testString);
      buf.seek(0);
      expect(readAscii32(buf)).toBe(testString);
    });

    it("should add and read Ascii64", () => {
      const buf = Buffer.alloc(256);
      addAscii64(buf, testString);
      buf.seek(0);
      expect(readAscii64(buf)).toBe(testString);
    });
  });

  describe("UTF-8 String", () => {
    it("should add and read String8", () => {
      const buf = Buffer.alloc(256);
      addString8(buf, "Hello, String8!");
      buf.seek(0);
      expect(readString8(buf)).toBe("Hello, String8!");
    });

    it("should add and read String16", () => {
      const buf = Buffer.alloc(256);
      addString16(buf, "Hello, String16!");
      buf.seek(0);
      expect(readString16(buf)).toBe("Hello, String16!");
    });

    it("should add and read String32", () => {
      const buf = Buffer.alloc(256);
      addString32(buf, "Hello, String32!");
      buf.seek(0);
      expect(readString32(buf)).toBe("Hello, String32!");
    });

    it("should add and read String64", () => {
      const buf = Buffer.alloc(256);
      addString64(buf, "Hello, String64!");
      buf.seek(0);
      expect(readString64(buf)).toBe("Hello, String64!");
    });
  });
});
```

**Step 3: Run tests**

Run: `npx jest tests/strings.test.ts --verbose`
Expected: All pass.

**Step 4: Commit**

```bash
git add src/strings.ts tests/strings.test.ts
git commit -m "feat: add standalone string functions with tests"
```

---

### Task 5: Create bool.ts and bigint.ts

**Files:**
- Create: `src/bool.ts`
- Create: `src/bigint.ts`

**Step 1: Write bool functions**

```typescript
import { Buffer } from "./buffer.js";
import { readUInt8 } from "./integers.js";

export function addBool<B extends Buffer>(buf: B, b: boolean): B {
  buf.addOne(b ? 1 : 0);
  return buf;
}

export function readBool(buf: Buffer): boolean {
  return readUInt8(buf) === 1;
}
```

**Step 2: Write bigint functions**

```typescript
import { Buffer } from "./buffer.js";
import { addByteArray8, readByteArray8 } from "./byteArrays.js";

export function addBigInt<B extends Buffer>(buf: B, n: bigint): B {
  let hex = n.toString(16);
  if (hex.length % 2 === 1) {
    hex = "0" + hex;
  }

  const length = hex.length / 2;
  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }

  if (length > 255) {
    throw new Error("BigInt too large for this simple implementation");
  }

  return addByteArray8(buf, bytes);
}

export function readBigInt(buf: Buffer): bigint {
  const bytes = readByteArray8(buf);
  let hex = "";

  bytes.forEach((byte) => {
    hex += byte.toString(16).padStart(2, "0");
  });

  return BigInt("0x" + hex);
}
```

**Step 3: Write tests**

Create `tests/bool-bigint.test.ts`:

```typescript
import { Buffer } from "../src/buffer.js";
import { addBool, readBool } from "../src/bool.js";
import { addBigInt, readBigInt } from "../src/bigint.js";

describe("Standalone bool", () => {
  it("should add and read true", () => {
    const buf = Buffer.alloc(64);
    addBool(buf, true);
    buf.seek(0);
    expect(readBool(buf)).toBe(true);
  });

  it("should add and read false", () => {
    const buf = Buffer.alloc(64);
    addBool(buf, false);
    buf.seek(0);
    expect(readBool(buf)).toBe(false);
  });
});

describe("Standalone bigint", () => {
  it("should add and read a BigInt value", () => {
    const buf = Buffer.alloc(256);
    const val = BigInt("123456789012345678901234567890");
    addBigInt(buf, val);
    buf.seek(0);
    expect(readBigInt(buf)).toBe(val);
  });

  it("should throw for BigInt larger than 255 bytes", () => {
    const buf = Buffer.alloc(512);
    const large = BigInt("0x" + "ff".repeat(256));
    expect(() => addBigInt(buf, large)).toThrow("BigInt too large for this simple implementation");
  });
});
```

**Step 4: Run tests**

Run: `npx jest tests/bool-bigint.test.ts --verbose`
Expected: All pass.

**Step 5: Commit**

```bash
git add src/bool.ts src/bigint.ts tests/bool-bigint.test.ts
git commit -m "feat: add standalone bool and bigint functions with tests"
```

---

### Task 6: Create arrays.ts and embed.ts

**Files:**
- Create: `src/arrays.ts`
- Create: `src/embed.ts`

**Step 1: Write array functions**

```typescript
import { Buffer } from "./buffer.js";
import { addUInt8, readUInt8, addUInt16, readUInt16, addUInt32, readUInt32, addUInt64, readUInt64 } from "./integers.js";

function readArray<T>(buf: Buffer, length: number, fn: (b: Buffer) => T): T[] {
  const array = new Array(length);
  for (let i = 0; i < length; i++) {
    array[i] = fn(buf);
  }
  return array;
}

export function addArray8<B extends Buffer, T>(buf: B, arr: T[], fn: (b: B, item: T) => void): B {
  addUInt8(buf, arr.length);
  arr.forEach((item) => fn(buf, item));
  return buf;
}

export function readArray8<T>(buf: Buffer, fn: (b: Buffer) => T): T[] {
  const length = readUInt8(buf);
  return readArray(buf, length, fn);
}

export function addArray16<B extends Buffer, T>(buf: B, arr: T[], fn: (b: B, item: T) => void): B {
  addUInt16(buf, arr.length);
  arr.forEach((item) => fn(buf, item));
  return buf;
}

export function readArray16<T>(buf: Buffer, fn: (b: Buffer) => T): T[] {
  const length = readUInt16(buf);
  return readArray(buf, length, fn);
}

export function addArray32<B extends Buffer, T>(buf: B, arr: T[], fn: (b: B, item: T) => void): B {
  addUInt32(buf, arr.length);
  arr.forEach((item) => fn(buf, item));
  return buf;
}

export function readArray32<T>(buf: Buffer, fn: (b: Buffer) => T): T[] {
  const length = readUInt32(buf);
  return readArray(buf, length, fn);
}

export function addArray64<B extends Buffer, T>(buf: B, arr: T[], fn: (b: B, item: T) => void): B {
  addUInt64(buf, arr.length);
  arr.forEach((item) => fn(buf, item));
  return buf;
}

export function readArray64<T>(buf: Buffer, fn: (b: Buffer) => T): T[] {
  const length = readUInt64(buf);
  return readArray(buf, length, fn);
}
```

**Step 2: Write embed functions**

```typescript
import { Buffer } from "./buffer.js";

export function embedSia<B extends Buffer>(buf: B, other: Buffer): B {
  buf.add(other.toUint8Array());
  return buf;
}

export function embedBytes<B extends Buffer>(buf: B, bytes: Uint8Array): B {
  buf.add(bytes);
  return buf;
}
```

**Step 3: Write tests**

Create `tests/arrays-embed.test.ts`:

```typescript
import { Buffer } from "../src/buffer.js";
import { addUInt8, readUInt8, addUInt16, readUInt16, addUInt32, readUInt32, addUInt64, readUInt64 } from "../src/integers.js";
import { addArray8, readArray8, addArray16, readArray16, addArray32, readArray32, addArray64, readArray64 } from "../src/arrays.js";
import { embedSia, embedBytes } from "../src/embed.js";

describe("Standalone arrays", () => {
  it("should add and read array8", () => {
    const buf = Buffer.alloc(256);
    addArray8(buf, [1, 2, 3, 255], (b, n) => addUInt8(b, n));
    buf.seek(0);
    expect(readArray8(buf, (b) => readUInt8(b))).toEqual([1, 2, 3, 255]);
  });

  it("should add and read array16", () => {
    const buf = Buffer.alloc(256);
    addArray16(buf, [1000, 2000, 3000, 65535], (b, n) => addUInt16(b, n));
    buf.seek(0);
    expect(readArray16(buf, (b) => readUInt16(b))).toEqual([1000, 2000, 3000, 65535]);
  });

  it("should add and read array32", () => {
    const buf = Buffer.alloc(256);
    addArray32(buf, [100000, 200000, 4294967295], (b, n) => addUInt32(b, n));
    buf.seek(0);
    expect(readArray32(buf, (b) => readUInt32(b))).toEqual([100000, 200000, 4294967295]);
  });

  it("should add and read array64", () => {
    const buf = Buffer.alloc(256);
    addArray64(buf, [9007199254740991, 1234567890123456], (b, n) => addUInt64(b, n));
    buf.seek(0);
    expect(readArray64(buf, (b) => readUInt64(b))).toEqual([9007199254740991, 1234567890123456]);
  });
});

describe("Standalone embed", () => {
  it("should embed another buffer's content", () => {
    const buf1 = Buffer.alloc(64);
    const buf2 = Buffer.alloc(64);
    addUInt8(buf2, 42);
    addUInt8(buf2, 99);
    embedSia(buf1, buf2);
    buf1.seek(0);
    expect(readUInt8(buf1)).toBe(42);
    expect(readUInt8(buf1)).toBe(99);
  });

  it("should embed raw bytes", () => {
    const buf = Buffer.alloc(64);
    embedBytes(buf, new Uint8Array([1, 2, 3]));
    buf.seek(0);
    expect(readUInt8(buf)).toBe(1);
    expect(readUInt8(buf)).toBe(2);
    expect(readUInt8(buf)).toBe(3);
  });
});
```

**Step 4: Run tests**

Run: `npx jest tests/arrays-embed.test.ts --verbose`
Expected: All pass.

**Step 5: Commit**

```bash
git add src/arrays.ts src/embed.ts tests/arrays-embed.test.ts
git commit -m "feat: add standalone array and embed functions with tests"
```

---

### Task 7: Create slim Sia class wrapper

**Files:**
- Create: `src/sia.ts`

**Step 1: Write the Sia wrapper class**

The Sia class extends Buffer and delegates every method to the corresponding standalone function. It preserves the exact same API as before.

```typescript
import { Buffer } from "./buffer.js";
import {
  addUInt8, readUInt8, addInt8, readInt8,
  addUInt16, readUInt16, addInt16, readInt16,
  addUInt32, readUInt32, addInt32, readInt32,
  addUInt64, readUInt64, addInt64, readInt64,
} from "./integers.js";
import {
  addUtfz, readUtfz,
  addAsciiN, readAsciiN, addAscii8, readAscii8,
  addAscii16, readAscii16, addAscii32, readAscii32,
  addAscii64, readAscii64,
  addString8, readString8, addString16, readString16,
  addString32, readString32, addString64, readString64,
} from "./strings.js";
import {
  addByteArrayN, readByteArrayN,
  addByteArray8, readByteArray8,
  addByteArray16, readByteArray16,
  addByteArray32, readByteArray32,
  addByteArray64, readByteArray64,
} from "./byteArrays.js";
import { addBool, readBool } from "./bool.js";
import { addBigInt, readBigInt } from "./bigint.js";
import {
  addArray8, readArray8, addArray16, readArray16,
  addArray32, readArray32, addArray64, readArray64,
} from "./arrays.js";
import { embedSia as _embedSia, embedBytes as _embedBytes } from "./embed.js";

export class Sia extends Buffer {
  static alloc(size: number): Sia {
    return new Sia(new Uint8Array(size));
  }

  static allocUnsafe(size: number): Sia {
    return new Sia(Buffer.allocUnsafe(size).content);
  }

  // Integers
  addUInt8(n: number): Sia { return addUInt8(this, n); }
  readUInt8(): number { return readUInt8(this); }
  addInt8(n: number): Sia { return addInt8(this, n); }
  readInt8(): number { return readInt8(this); }
  addUInt16(n: number): Sia { return addUInt16(this, n); }
  readUInt16(): number { return readUInt16(this); }
  addInt16(n: number): Sia { return addInt16(this, n); }
  readInt16(): number { return readInt16(this); }
  addUInt32(n: number): Sia { return addUInt32(this, n); }
  readUInt32(): number { return readUInt32(this); }
  addInt32(n: number): Sia { return addInt32(this, n); }
  readInt32(): number { return readInt32(this); }
  addUInt64(n: number): Sia { return addUInt64(this, n); }
  readUInt64(): number { return readUInt64(this); }
  addInt64(n: number): Sia { return addInt64(this, n); }
  readInt64(): number { return readInt64(this); }

  // Strings
  addUtfz(str: string): Sia { return addUtfz(this, str); }
  readUtfz(): string { return readUtfz(this); }
  addAsciiN(str: string): Sia { return addAsciiN(this, str); }
  readAsciiN(length: number): string { return readAsciiN(this, length); }
  addAscii8(str: string): Sia { return addAscii8(this, str); }
  readAscii8(): string { return readAscii8(this); }
  addAscii16(str: string): Sia { return addAscii16(this, str); }
  readAscii16(): string { return readAscii16(this); }
  addAscii32(str: string): Sia { return addAscii32(this, str); }
  readAscii32(): string { return readAscii32(this); }
  addAscii64(str: string): Sia { return addAscii64(this, str); }
  readAscii64(): string { return readAscii64(this); }
  addString8(str: string): Sia { return addString8(this, str); }
  readString8(): string { return readString8(this); }
  addString16(str: string): Sia { return addString16(this, str); }
  readString16(): string { return readString16(this); }
  addString32(str: string): Sia { return addString32(this, str); }
  readString32(): string { return readString32(this); }
  addString64(str: string): Sia { return addString64(this, str); }
  readString64(): string { return readString64(this); }

  // Byte arrays
  addByteArrayN(bytes: Uint8Array): Sia { return addByteArrayN(this, bytes); }
  readByteArrayN(length: number, asReference = false): Uint8Array { return readByteArrayN(this, length, asReference); }
  addByteArray8(bytes: Uint8Array): Sia { return addByteArray8(this, bytes); }
  readByteArray8(asReference = false): Uint8Array { return readByteArray8(this, asReference); }
  addByteArray16(bytes: Uint8Array): Sia { return addByteArray16(this, bytes); }
  readByteArray16(asReference = false): Uint8Array { return readByteArray16(this, asReference); }
  addByteArray32(bytes: Uint8Array): Sia { return addByteArray32(this, bytes); }
  readByteArray32(asReference = false): Uint8Array { return readByteArray32(this, asReference); }
  addByteArray64(bytes: Uint8Array): Sia { return addByteArray64(this, bytes); }
  readByteArray64(asReference = false): Uint8Array { return readByteArray64(this, asReference); }

  // Bool
  addBool(b: boolean): Sia { return addBool(this, b); }
  readBool(): boolean { return readBool(this); }

  // BigInt
  addBigInt(n: bigint): Sia { return addBigInt(this, n); }
  readBigInt(): bigint { return readBigInt(this); }

  // Arrays
  addArray8<T>(arr: T[], fn: (s: Sia, item: T) => void): Sia { return addArray8(this, arr, fn); }
  readArray8<T>(fn: (s: Sia) => T): T[] { return readArray8(this, fn); }
  addArray16<T>(arr: T[], fn: (s: Sia, item: T) => void): Sia { return addArray16(this, arr, fn); }
  readArray16<T>(fn: (s: Sia) => T): T[] { return readArray16(this, fn); }
  addArray32<T>(arr: T[], fn: (s: Sia, item: T) => void): Sia { return addArray32(this, arr, fn); }
  readArray32<T>(fn: (s: Sia) => T): T[] { return readArray32(this, fn); }
  addArray64<T>(arr: T[], fn: (s: Sia, item: T) => void): Sia { return addArray64(this, arr, fn); }
  readArray64<T>(fn: (s: Sia) => T): T[] { return readArray64(this, fn); }

  // Embed
  embedSia(sia: Sia): Sia { return _embedSia(this, sia); }
  embedBytes(bytes: Uint8Array): Sia { return _embedBytes(this, bytes); }
}
```

**Step 2: Commit**

```bash
git add src/sia.ts
git commit -m "feat: add Sia wrapper class delegating to standalone functions"
```

---

### Task 8: Update index.ts and verify backward compatibility

**Files:**
- Modify: `src/index.ts`

**Step 1: Replace index.ts with re-exports**

```typescript
export { Buffer } from "./buffer.js";
export { Sia } from "./sia.js";

// Integers
export {
  addUInt8, readUInt8, addInt8, readInt8,
  addUInt16, readUInt16, addInt16, readInt16,
  addUInt32, readUInt32, addInt32, readInt32,
  addUInt64, readUInt64, addInt64, readInt64,
} from "./integers.js";

// Strings
export {
  addUtfz, readUtfz,
  addAsciiN, readAsciiN, addAscii8, readAscii8,
  addAscii16, readAscii16, addAscii32, readAscii32,
  addAscii64, readAscii64,
  addString8, readString8, addString16, readString16,
  addString32, readString32, addString64, readString64,
} from "./strings.js";

// Byte arrays
export {
  addByteArrayN, readByteArrayN,
  addByteArray8, readByteArray8,
  addByteArray16, readByteArray16,
  addByteArray32, readByteArray32,
  addByteArray64, readByteArray64,
} from "./byteArrays.js";

// Bool
export { addBool, readBool } from "./bool.js";

// BigInt
export { addBigInt, readBigInt } from "./bigint.js";

// Arrays
export {
  addArray8, readArray8, addArray16, readArray16,
  addArray32, readArray32, addArray64, readArray64,
} from "./arrays.js";

// Embed
export { embedSia, embedBytes } from "./embed.js";
```

**Step 2: Run ALL tests (existing + new)**

Run: `npx jest --verbose`
Expected: All tests pass — both existing `sia.test.ts` and all new standalone function tests.

**Step 3: Commit**

```bash
git add src/index.ts
git commit -m "refactor: replace monolithic Sia with re-exports of standalone functions"
```

---

### Task 9: Add functional API benchmark

**Files:**
- Create: `src/benchmark/tests/sia-functional.ts`
- Modify: `src/benchmark/index.ts`

**Step 1: Write the functional benchmark**

Create `src/benchmark/tests/sia-functional.ts`:

```typescript
import { Buffer } from "../../buffer.js";
import { addArray16, readArray16 } from "../../arrays.js";
import { addAscii8, readAscii8 } from "../../strings.js";
import { addInt64, readInt64 } from "../../integers.js";
import { fiveThousandUsers } from "./common.js";

const buf = Buffer.alloc(32 * 1024 * 1024);

export const siaFunctionalFiveThousandUsers = () => {
  buf.seek(0);
  addArray16(buf, fiveThousandUsers, (b, user) => {
    addAscii8(b, user.userId);
    addAscii8(b, user.username);
    addAscii8(b, user.email);
    addAscii8(b, user.avatar);
    addAscii8(b, user.password);
    addInt64(b, user.birthdate.valueOf());
    addInt64(b, user.registeredAt.valueOf());
  });
  return buf.toUint8ArrayReference();
};

const encoded = siaFunctionalFiveThousandUsers();
const deBuf = new Buffer(encoded);

const decodeUser = (b: Buffer) => ({
  userId: readAscii8(b),
  username: readAscii8(b),
  email: readAscii8(b),
  avatar: readAscii8(b),
  password: readAscii8(b),
  birthdate: new Date(readInt64(b)),
  registeredAt: new Date(readInt64(b)),
});

export const siaFunctionalFiveThousandUsersDecode = () => {
  deBuf.seek(0);
  return readArray16(deBuf, decodeUser);
};
```

**Step 2: Add to benchmark runner**

Add to `src/benchmark/index.ts`:
- Import `siaFunctionalFiveThousandUsers` and `siaFunctionalFiveThousandUsersDecode`
- Add `bench.add("Sializer (functional)", () => siaFunctionalFiveThousandUsers());`
- Add `deserializeBench.add("Sializer (functional)", () => siaFunctionalFiveThousandUsersDecode());`
- Add `console.log("Sia (functional) file size:", siaFunctionalFiveThousandUsers().length);`

**Step 3: Commit**

```bash
git add src/benchmark/tests/sia-functional.ts src/benchmark/index.ts
git commit -m "feat: add functional API benchmark case"
```

---

### Task 10: Final verification

**Step 1: Run all tests**

Run: `npx jest --verbose`
Expected: All tests pass.

**Step 2: Run TypeScript compiler check**

Run: `npx tsc --noEmit`
Expected: No type errors.

**Step 3: Build**

Run: `npx tsc`
Expected: Clean build to `dist/`.

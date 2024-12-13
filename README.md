# Sia

Sia serialization for JavaScript/TypeScript

## What is Sia?

Sia is the serialization library used by [Unchained](https://github.com/TimeleapLabs/unchained). Check more details on [Sia's official documentation](https://timeleap.swiss/docs/products/sia).

## Installation

```bash
npm install @timeleap/sia
```

## Usage

```python
import { Sia } from "@timeleap/sia";

type Person = {
  name?: string;
  age?: number;
};

const sia = new Sia();
const person: Person = { name: "Pouya", age: 33 };

const payload = sia
  .seek(0)
  .addAscii(person.name ?? "")
  .addUInt8(person.age ?? 0)
  .toUint8ArrayReference();

console.log(payload); // Uint8Array(7) [5, 80, 111, 117, 121, 97,  33]

const desia = new Sia(payload);
const deserialized: Person = {
  name: desia.readAscii(),
  age: desia.readUInt8(),
};

console.log(deserialized); // { name: 'Pouya', age: 33 }
```

## Serializers

Sia provides a set of serializers for each primitive type. They are most useful for cases where you're adding an array of values. Instead of writing the function yourself, just use the exported utility functions.

```typescript
import { Sia, serializeString8ArrayItem } from "@timeleap/sia";

const sia = new Sia();

sia.addArray8(["Hello", "World"], serializeString8ArrayItem);
```

The `serializeString8ArrayItem` runs for each item in the array and adds the item to the Sia content.

## Deserializers

For the opposite scenario, where you want to read an array of values from the Sia content, you can use the `readArray8` method in combination with the deserializers.

```typescript
import {
  Sia,
  serializeString8ArrayItem,
  readString8ArrayItem,
} from "@timeleap/sia";

const sia = new Sia();

sia.addArray8(["Hello", "World"], serializeString8ArrayItem);

const desia = new Sia().setContent(sia.content);

const deserialized = desia.readArray8(readString8ArrayItem);

console.log(deserialized); // ["Hello", "World"]
```

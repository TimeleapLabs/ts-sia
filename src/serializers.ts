import { Sia } from "./index.js";

// Serializers
export function serializeInt8ArrayItem(sia: Sia, value: number) {
  return sia.addInt8(value);
}

export function serializeInt16ArrayItem(sia: Sia, value: number) {
  return sia.addInt16(value);
}

export function serializeInt32ArrayItem(sia: Sia, value: number) {
  return sia.addInt32(value);
}

export function serializeInt64ArrayItem(sia: Sia, value: number) {
  return sia.addInt64(value);
}

export function serializeUInt8ArrayItem(sia: Sia, value: number) {
  return sia.addUInt8(value);
}

export function serializeUInt16ArrayItem(sia: Sia, value: number) {
  return sia.addUInt16(value);
}

export function serializeUInt32ArrayItem(sia: Sia, value: number) {
  return sia.addUInt32(value);
}

export function serializeUInt64ArrayItem(sia: Sia, value: number) {
  return sia.addUInt64(value);
}

export function serializeString8ArrayItem(sia: Sia, value: string) {
  return sia.addString8(value);
}

export function serializeString16ArrayItem(sia: Sia, value: string) {
  return sia.addString16(value);
}

export function serializeString32ArrayItem(sia: Sia, value: string) {
  return sia.addString32(value);
}

export function serializeString64ArrayItem(sia: Sia, value: string) {
  return sia.addString64(value);
}

export function serializeByteArray8ArrayItem(sia: Sia, value: Uint8Array) {
  return sia.addByteArray8(value);
}

export function serializeByteArray16ArrayItem(sia: Sia, value: Uint8Array) {
  return sia.addByteArray16(value);
}

export function serializeByteArray32ArrayItem(sia: Sia, value: Uint8Array) {
  return sia.addByteArray32(value);
}

export function serializeByteArray64ArrayItem(sia: Sia, value: Uint8Array) {
  return sia.addByteArray64(value);
}

export function serializeBoolArrayItem(sia: Sia, value: boolean) {
  return sia.addBool(value);
}

export function serializeBigIntArrayItem(sia: Sia, value: bigint) {
  return sia.addBigInt(value);
}

// Deserializers
export function readInt8ArrayItem(sia: Sia) {
  return sia.readInt8();
}

export function readInt16ArrayItem(sia: Sia) {
  return sia.readInt16();
}

export function readInt32ArrayItem(sia: Sia) {
  return sia.readInt32();
}

export function readInt64ArrayItem(sia: Sia) {
  return sia.readInt64();
}

export function readUInt8ArrayItem(sia: Sia) {
  return sia.readUInt8();
}

export function readUInt16ArrayItem(sia: Sia) {
  return sia.readUInt16();
}

export function readUInt32ArrayItem(sia: Sia) {
  return sia.readUInt32();
}

export function readUInt64ArrayItem(sia: Sia) {
  return sia.readUInt64();
}

export function readString8ArrayItem(sia: Sia) {
  return sia.readString8();
}

export function readString16ArrayItem(sia: Sia) {
  return sia.readString16();
}

export function readString32ArrayItem(sia: Sia) {
  return sia.readString32();
}

export function readString64ArrayItem(sia: Sia) {
  return sia.readString64();
}

export function readByteArray8ArrayItem(sia: Sia) {
  return sia.readByteArray8();
}

export function readByteArray16ArrayItem(sia: Sia) {
  return sia.readByteArray16();
}

export function readByteArray32ArrayItem(sia: Sia) {
  return sia.readByteArray32();
}

export function readByteArray64ArrayItem(sia: Sia) {
  return sia.readByteArray64();
}

export function readBoolArrayItem(sia: Sia) {
  return sia.readBool();
}

export function readBigIntArrayItem(sia: Sia) {
  return sia.readBigInt();
}

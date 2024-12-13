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
export function deserializeInt8ArrayItem(sia: Sia) {
  return sia.readInt8();
}

export function deserializeInt16ArrayItem(sia: Sia) {
  return sia.readInt16();
}

export function deserializeInt32ArrayItem(sia: Sia) {
  return sia.readInt32();
}

export function deserializeInt64ArrayItem(sia: Sia) {
  return sia.readInt64();
}

export function deserializeUInt8ArrayItem(sia: Sia) {
  return sia.readUInt8();
}

export function deserializeUInt16ArrayItem(sia: Sia) {
  return sia.readUInt16();
}

export function deserializeUInt32ArrayItem(sia: Sia) {
  return sia.readUInt32();
}

export function deserializeUInt64ArrayItem(sia: Sia) {
  return sia.readUInt64();
}

export function deserializeString8ArrayItem(sia: Sia) {
  return sia.readString8();
}

export function deserializeString16ArrayItem(sia: Sia) {
  return sia.readString16();
}

export function deserializeString32ArrayItem(sia: Sia) {
  return sia.readString32();
}

export function deserializeString64ArrayItem(sia: Sia) {
  return sia.readString64();
}

export function deserializeByteArray8ArrayItem(sia: Sia) {
  return sia.readByteArray8();
}

export function deserializeByteArray16ArrayItem(sia: Sia) {
  return sia.readByteArray16();
}

export function deserializeByteArray32ArrayItem(sia: Sia) {
  return sia.readByteArray32();
}

export function deserializeByteArray64ArrayItem(sia: Sia) {
  return sia.readByteArray64();
}

export function deserializeBoolArrayItem(sia: Sia) {
  return sia.readBool();
}

export function deserializeBigIntArrayItem(sia: Sia) {
  return sia.readBigInt();
}

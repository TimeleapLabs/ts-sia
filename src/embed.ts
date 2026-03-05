import { Buffer } from "./buffer.js";

export function embedSia<B extends Buffer>(buf: B, other: Buffer): B {
  buf.add(other.toUint8Array());
  return buf;
}

export function embedBytes<B extends Buffer>(buf: B, bytes: Uint8Array): B {
  buf.add(bytes);
  return buf;
}

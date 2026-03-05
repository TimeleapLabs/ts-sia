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

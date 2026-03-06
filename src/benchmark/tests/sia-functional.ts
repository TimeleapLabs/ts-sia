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
  birthdate: readInt64(b),
  registeredAt: readInt64(b),
});

export const siaFunctionalFiveThousandUsersDecode = () => {
  deBuf.seek(0);
  return readArray16(deBuf, decodeUser);
};

import { Sia } from "../../index.js";
import { fiveThousandUsers } from "./common.js";

const sia = new Sia();

export const siaFiveThousandUsers = () =>
  sia
    .seek(0)
    .addArray16(fiveThousandUsers, (sia, user) => {
      sia
        .addAscii8(user.userId)
        .addAscii8(user.username)
        .addAscii8(user.email)
        .addAscii8(user.avatar)
        .addAscii8(user.password)
        .addInt64(user.birthdate.valueOf())
        .addInt64(user.registeredAt.valueOf());
    })
    .toUint8ArrayReference();

const encoded = siaFiveThousandUsers();
const desia = new Sia(encoded);

const decodeUser = (sia: Sia) => ({
  userId: sia.readAscii8(),
  username: sia.readAscii8(),
  email: sia.readAscii8(),
  avatar: sia.readAscii8(),
  password: sia.readAscii8(),
  birthdate: sia.readInt64(),
  registeredAt: sia.readInt64(),
});

export const siaFiveThousandUsersDecode = () =>
  desia.seek(0).readArray16(decodeUser);

import { fiveThousandUsers } from "./common.js";
import { Users } from "./generated/user.js";

export const protobufFiveThousandUsers = () =>
  Users.encode({
    users: fiveThousandUsers.map((user) => ({
      ...user,
      birthdate: user.birthdate.getTime(),
      registeredAt: user.registeredAt.getTime(),
    })),
  }).finish();

const encoded = protobufFiveThousandUsers();

export const protobufFiveThousandUsersDecode = () => {
  const { users } = Users.decode(encoded);
  return users;
};

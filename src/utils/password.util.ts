// ! src/utils/password.util.ts

import bcrypt, { genSalt } from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  const salt: string = await genSalt(10);
  return bcrypt.hash(password, salt);
};

export const compairePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

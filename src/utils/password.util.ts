// ! src/utils/password.util.ts

import bcrypt, { genSalt } from "bcrypt";

export const hashPassword: (password: string) => Promise<string> =
 async (password: string): Promise<string> => {
  const salt: string = await genSalt(10);
  return bcrypt.hash(password, salt);
};

export const compairePassword: (password: string, hashedPassword: string) => Promise<boolean> = 
async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

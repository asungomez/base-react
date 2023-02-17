import { Auth } from "aws-amplify";
import { CognitoUser } from "amazon-cognito-identity-js";

export type User = {
  id?: number;
  email: string;
  password?: string;
  name?: string;
  mustChangePassword: boolean;
};

const USERS: User[] = [
  {
    id: 1,
    email: "user1@fake.email",
    password: "1234",
    name: "Fake User",
    mustChangePassword: false,
  },
  {
    id: 2,
    email: "user2@fake.email",
    password: "abcd",
    name: "Another User",
    mustChangePassword: true,
  },
  {
    id: 3,
    email: "user3@fake.email",
    password: "abcd",
    name: "Some rando",
    mustChangePassword: true,
  },
];

const sleep = async (ms: number) => new Promise((r) => setTimeout(r, ms));

export const createUser = async (email: string, password: string) => {
  await sleep(1000);
  const existingUser = USERS.find((user) => user.email === email);
  if (existingUser) {
    throw new Error("DUPLICATED_USER");
  }
  const user: User = {
    id: USERS.length + 1,
    email,
    password,
    mustChangePassword: true,
  };
  USERS.push(user);
  return user;
};

export const currentUser = async () => {
  await sleep(1000);
  return USERS[0];
};

export const forgotPassword = async (email: string) => {
  try {
    await Auth.forgotPassword(email);
  } catch (error) {
    if (hasCode(error)) {
      if (error.code === "UserNotFoundException") {
        throw new Error("USER_NOT_EXISTS");
      }
    }
    throw new Error("INTERNAL_ERROR");
  }
};

export const getUsers = async () => {
  await sleep(1000);
  return USERS;
};

export const getAuthenticatedUser = async (): Promise<CognitoUser | null> => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    return user;
  } catch (error) {
    return null;
  }
};

const hasCode = (value: unknown): value is { code: string } =>
  typeof value === "object" &&
  (value as Record<string, unknown>).code !== undefined;

export const logIn = async (
  email: string,
  password: string
): Promise<CognitoUser> => {
  try {
    const user = await Auth.signIn(email, password);
    return user;
  } catch (error) {
    if (hasCode(error)) {
      if (error.code === "UserNotFoundException") {
        throw new Error("USER_NOT_EXISTS");
      }
      if (error.code === "NotAuthorizedException") {
        throw new Error("INCORRECT_PASSWORD");
      }
    }
    throw new Error("INTERNAL_ERROR");
  }
};

export const logOut = async () => {
  try {
    await Auth.signOut();
  } catch (e) {
    throw new Error("INTERNAL_ERROR");
  }
};

export const resetPassword = async (
  email: string,
  newPassword: string,
  code: string
) => {
  try {
    await Auth.forgotPasswordSubmit(email, code, newPassword);
  } catch (error) {
    if (hasCode(error)) {
      if (error.code === "UserNotFoundException") {
        throw new Error("USER_NOT_EXISTS");
      }
      if (error.code === "InvalidPasswordException") {
        throw new Error("INVALID_PASSWORD");
      }
      if (error.code === "CodeMismatchException") {
        throw new Error("INVALID_RESET_PASSWORD_LINK");
      }
      if (error.code === "LimitExceededException") {
        throw new Error("TOO_MANY_RETRIES");
      }
    }
    throw new Error("INTERNAL_ERROR");
  }
};

export const setPassword = async (user: CognitoUser, newPassword: string) => {
  try {
    const updatedUser = await Auth.completeNewPassword(user, newPassword);
    return updatedUser;
  } catch (error) {
    if (hasCode(error)) {
      if (error.code === "InvalidPasswordException") {
        throw new Error("INVALID_PASSWORD");
      }
    }
    throw new Error("INTERNAL_ERROR");
  }
};

export const updateName = async (email: string, newName: string) => {
  await sleep(1000);
  const userIndex = USERS.findIndex((user) => email === user.email);
  if (userIndex === -1) {
    throw new Error("USER_NOT_EXISTS");
  }
  const newUser = {
    ...USERS[userIndex],
    name: newName,
  };
  USERS[userIndex] = newUser;
  return newUser;
};

export const updatePassword = async (
  email: string,
  oldPassword: string,
  newPassword: string
) => {
  await sleep(1000);
  const userIndex = USERS.findIndex((user) => email === user.email);
  if (userIndex === -1) {
    throw new Error("USER_NOT_EXISTS");
  }
  if (oldPassword !== USERS[userIndex].password) {
    throw new Error("INCORRECT_PASSWORD");
  }
  const newUser = {
    ...USERS[userIndex],
    password: newPassword,
  };
  return newUser;
};

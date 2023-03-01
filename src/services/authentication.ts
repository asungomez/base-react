import { Auth } from "aws-amplify";
import { CognitoUser } from "amazon-cognito-identity-js";
import * as AdminQueries from "./adminQueries";

type UserResponse = {
  Username: string;
  Attributes: { Name: string; Value: string }[];
};

export type User = {
  id: string;
  email: string;
  name?: string;
};

export type CognitoUserWithAttributes = CognitoUser & {
  attributes?: {
    [key: string]: string;
  };
};

const sleep = async (ms: number) => new Promise((r) => setTimeout(r, ms));

export const createUser = async (email: string, password: string) => {
  await sleep(1000);
  // const existingUser = USERS.find((user) => user.email === email);
  // if (existingUser) {
  //   throw new Error("DUPLICATED_USER");
  // }
  // const user: User = {
  //   id: USERS.length + 1,
  //   email,
  //   password,
  //   mustChangePassword: true,
  // };
  // USERS.push(user);
  // return user;
};

const findAttributeValue = (user: UserResponse, attribute: string) =>
  user.Attributes.find((att) => att.Name === attribute)?.Value;

export const forgotPassword = async (email: string) => {
  try {
    await Auth.forgotPassword(email, {
      redirectTo: process.env.REACT_APP_HOST || "",
    });
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
  try {
    const response = await AdminQueries.get("/listUsers");
    if (
      !response.Users ||
      !Array.isArray(response.Users) ||
      !response.Users.length
    ) {
      return [];
    }
    const users = response.Users.map((user: unknown): User | null => {
      if (!hasUserAttributes(user)) {
        return null;
      }
      const id = user.Username;
      const email = findAttributeValue(user, "email");
      const name = findAttributeValue(user, "name");
      if (!id || !email) {
        return null;
      }
      return { id, email, name };
    }).filter(Boolean);
    return users;
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};

export const getAuthenticatedUser =
  async (): Promise<CognitoUserWithAttributes | null> => {
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

const hasUserAttributes = (value: unknown): value is UserResponse =>
  typeof value === "object" &&
  value !== null &&
  "Username" in value &&
  "Attributes" in value &&
  Array.isArray((value as UserResponse)["Attributes"]) &&
  (value as UserResponse)["Attributes"].reduce(
    (correct, value) => correct && isAttribute(value),
    true
  );

const isAttribute = (
  value: unknown
): value is { Name: string; Value: string } =>
  typeof value === "object" &&
  value !== null &&
  "Name" in value &&
  "Value" in value &&
  !!(value as { Name: string; Value: string })["Name"] &&
  !!(value as { Name: string; Value: string })["Value"];

export const logIn = async (
  email: string,
  password: string
): Promise<CognitoUserWithAttributes> => {
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

export const setPassword = async (
  user: CognitoUserWithAttributes,
  newPassword: string
) => {
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

export const updateName = async (
  user: CognitoUserWithAttributes,
  newName: string
): Promise<CognitoUserWithAttributes> => {
  try {
    await Auth.updateUserAttributes(user, { name: newName });
    const newUser: CognitoUserWithAttributes = user;
    Object.assign(user, newUser);
    newUser.attributes = {
      ...user.attributes,
      name: newName,
    };
    return newUser;
  } catch (error) {
    console.error(error);
    throw new Error("INTERNAL_ERROR");
  }
};

export const updatePassword = async (
  user: CognitoUserWithAttributes,
  oldPassword: string,
  newPassword: string
) => {
  try {
    await Auth.changePassword(user, oldPassword, newPassword);
  } catch (error) {
    if (hasCode(error)) {
      if (error.code === "NotAuthorizedException") {
        throw new Error("INCORRECT_PASSWORD");
      }
      if (error.code === "InvalidPasswordException") {
        throw new Error("INVALID_PASSWORD");
      }
    }
    throw new Error("INTERNAL_ERROR");
  }
};

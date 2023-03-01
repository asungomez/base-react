import { createContext, useContext } from "react";
import { CognitoUserWithAttributes } from "../services/authentication";

type AuthContextData = {
  user: CognitoUserWithAttributes | null;
  setUser?: (user: CognitoUserWithAttributes) => void;
  authStatus: "checking" | "authenticated" | "unauthenticated";
  logOut: () => Promise<void>;
  logIn: (user: CognitoUserWithAttributes) => void;
  isInGroup: (group: string) => boolean;
};

export const AuthContext = createContext<AuthContextData>({
  user: null,
  authStatus: "checking",
  logOut: async () => {
    console.log("Log out");
  },
  logIn: () => console.log("Log in"),
  isInGroup: () => false,
});

export const useAuth = () => useContext(AuthContext);

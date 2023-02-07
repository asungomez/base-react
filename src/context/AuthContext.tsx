import { CognitoUser } from "amazon-cognito-identity-js";
import { createContext, useContext } from "react";

type AuthContextData = {
  user: CognitoUser | null;
  setUser?: (user: CognitoUser) => void;
  authStatus: "checking" | "authenticated" | "unauthenticated";
  logOut: () => Promise<void>;
  logIn: (user: CognitoUser) => void;
};

export const AuthContext = createContext<AuthContextData>({
  user: null,
  authStatus: "checking",
  logOut: async () => {
    console.log("Log out");
  },
  logIn: () => console.log("Log in"),
});

export const useAuth = () => useContext(AuthContext);

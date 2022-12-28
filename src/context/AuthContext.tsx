import { CognitoUser } from "amazon-cognito-identity-js";
import { createContext, useContext } from "react";

type AuthContextData = {
  user: CognitoUser | null;
  setUser?: (user: CognitoUser) => void;
};

export const AuthContext = createContext<AuthContextData>({
  user: null,
});

export const useAuth = () => useContext(AuthContext);

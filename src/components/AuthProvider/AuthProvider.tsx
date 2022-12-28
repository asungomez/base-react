import { FC, ReactNode, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CognitoUser } from "amazon-cognito-identity-js";

type AuthProviderProps = {
  children?: ReactNode;
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<CognitoUser | null>(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

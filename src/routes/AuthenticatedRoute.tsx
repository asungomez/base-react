import { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type AuthenticatedRouteProps = {
  children: ReactNode;
};

export const AuthenticatedRoute: FC<AuthenticatedRouteProps> = ({
  children,
}) => {
  const { authStatus } = useAuth();

  return authStatus === "authenticated" ? (
    <>{children}</>
  ) : (
    <Navigate to="/log-in" />
  );
};

import { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type AuthenticatedRouteProps = {
  children: ReactNode;
};

export const UnauthenticatedRoute: FC<AuthenticatedRouteProps> = ({
  children,
}) => {
  const { authStatus } = useAuth();

  return authStatus === "unauthenticated" ? (
    <>{children}</>
  ) : (
    <Navigate to="/customers" />
  );
};

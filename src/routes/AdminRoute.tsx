import { FC, ReactElement } from "react";
import { Error } from "../components/Error/Error";
import { useAuth } from "../context/AuthContext";

type AdminRouteProps = {
  children: ReactElement;
};

export const AdminRoute: FC<AdminRouteProps> = ({ children }) => {
  const { isInGroup } = useAuth();

  return isInGroup("Admin") ? children : <Error code="UNAUTHORIZED" />;
};

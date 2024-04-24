import { FC } from "react";
import { useParams } from "react-router-dom";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";

type UserDetailsParams = {
  id: string;
};

export const UserDetails: FC = () => {
  const { id } = useParams<UserDetailsParams>();
  if (!id) {
    return <ErrorMessage code="INTERNAL_ERROR" />;
  }
  return <>{id}</>;
};

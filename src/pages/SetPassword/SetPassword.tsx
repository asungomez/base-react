import { Typography } from "@mui/material";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Error } from "../../components/Error/Error";
import {
  SetPasswordForm,
  SetPasswordFormValues,
} from "../../components/SetPasswordForm/SetPasswordForm";
import { setPassword } from "../../services/authentication";
import { ErrorCode, isErrorCode } from "../../services/error";
import { CognitoUser } from "amazon-cognito-identity-js";

type SetPasswordPageProps = {
  user: CognitoUser;
};

export const SetPasswordPage: FC<SetPasswordPageProps> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);

  const navigate = useNavigate();

  const submitHandler = ({ password }: SetPasswordFormValues) => {
    setLoading(true);
    setError(null);
    setPassword(user, password)
      .then(() => {
        setLoading(false);
        navigate("/users");
      })
      .catch((error) => {
        setLoading(false);
        if (isErrorCode(error.message)) {
          setError(error.message);
        } else {
          setError("INTERNAL_ERROR");
        }
      });
  };

  return (
    <>
      <Typography variant="h3" gutterBottom align="center">
        Set password
      </Typography>
      <Typography>
        Looks like this is your first time logging in. Please set a new password
        to continue.
      </Typography>
      {error && <Error code={error} />}
      <SetPasswordForm loading={loading} onSubmit={submitHandler} />
    </>
  );
};

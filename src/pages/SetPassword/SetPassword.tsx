import { Typography } from "@mui/material";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Error } from "../../components/Error/Error";
import {
  SetPasswordForm,
  SetPasswordFormValues,
} from "../../components/SetPasswordForm/SetPasswordForm";
import { useAuth } from "../../context/AuthContext";
import { setPassword } from "../../services/authentication";
import { ErrorCode, isErrorCode } from "../../services/error";

export const SetPasswordPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const { user, logIn } = useAuth();

  const navigate = useNavigate();

  const submitHandler = ({ password }: SetPasswordFormValues) => {
    if (user) {
      setLoading(true);
      setError(null);
      setPassword(user, password)
        .then((user) => {
          if (logIn) {
            logIn(user);
          }
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
    } else {
      navigate("/log-in");
    }
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

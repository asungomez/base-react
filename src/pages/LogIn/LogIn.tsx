import { Button, Typography } from "@mui/material";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Error } from "../../components/Error/Error";
import {
  LogInForm,
  LogInFormValues,
} from "../../components/LogInForm/LogInForm";
import { logIn } from "../../services/authentication";
import { ErrorCode, isErrorCode } from "../../services/error";
import { CognitoUser } from "amazon-cognito-identity-js";

type LogInPageProps = {
  onLogIn: (user: CognitoUser) => void;
};

export const LogInPage: FC<LogInPageProps> = ({ onLogIn }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);

  const navigate = useNavigate();

  const toForgotPassword = () => navigate("/forgot-password");

  const submitHandler = (formValues: LogInFormValues) => {
    setLoading(true);
    setError(null);
    logIn(formValues.email, formValues.password)
      .then((user) => {
        setLoading(false);
        onLogIn(user);
        if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
          navigate("/set-password");
        } else {
          navigate("/users");
        }
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
        Log in
      </Typography>
      {error && <Error code={error} />}
      <LogInForm loading={loading} onSubmit={submitHandler} />
      <Button onClick={toForgotPassword}>Forgot your password?</Button>
    </>
  );
};

import { Typography } from "@mui/material";
import { FC, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Error } from "../../components/Error/Error";
import {
  ResetPasswordForm,
  ResetPasswordFormValues,
} from "../../components/ResetPasswordForm/ResetPasswordForm";
import { resetPassword } from "../../services/authentication";
import { ErrorCode, isErrorCode } from "../../services/error";

export const ResetPasswordPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const [searchParameters] = useSearchParams();
  const email = searchParameters.get("email");
  const code = searchParameters.get("code");

  const navigate = useNavigate();

  const submitHandler = ({ password }: ResetPasswordFormValues) => {
    if (email && code) {
      setLoading(true);
      setError(null);
      resetPassword(email, password, code)
        .then(() => {
          setLoading(false);
          navigate("/log-in");
        })
        .catch((error) => {
          setLoading(false);
          if (isErrorCode(error.message)) {
            setError(error.message);
          } else {
            setError("INTERNAL_ERROR");
          }
        });
    }
  };

  return (
    <>
      <Typography variant="h3" gutterBottom align="center">
        Reset your password
      </Typography>
      <Typography>Set a new password for logging in.</Typography>
      {error && <Error code={error} />}
      <ResetPasswordForm loading={loading} onSubmit={submitHandler} />
    </>
  );
};

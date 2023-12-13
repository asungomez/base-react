import { Alert, Button, Typography } from "@mui/material";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorCode } from "../../services/error";

type ErrorProps = {
  code: ErrorCode;
};

export const Error: FC<ErrorProps> = ({ code }) => {
  const navigate = useNavigate();

  const toForgotPassword = () => navigate("/forgot-password");
  const toLogIn = () => navigate("/log-in");
  const toCustomers = () => navigate("/customers");

  if (code === "INCORRECT_PASSWORD") {
    return (
      <Alert severity="warning">
        <Typography>Your password is incorrect</Typography>
        <Button color="inherit" onClick={toForgotPassword}>
          Forgot your password?
        </Button>
      </Alert>
    );
  }
  if (code === "USER_NOT_EXISTS") {
    return (
      <Alert severity="warning">
        <Typography>This email is not registered</Typography>
      </Alert>
    );
  }
  if (code === "INVALID_PASSWORD") {
    return (
      <Alert severity="warning">
        <Typography>
          Your password is not valid, please set a different one
        </Typography>
      </Alert>
    );
  }
  if (code === "DUPLICATED_USER") {
    return (
      <Alert severity="warning">
        <Typography>The email you specified is already registered</Typography>
      </Alert>
    );
  }
  if (code === "INVALID_RESET_PASSWORD_LINK") {
    return (
      <Alert severity="error">
        <Typography>This reset password link is not valid</Typography>
        <Button color="inherit" onClick={toLogIn}>
          Log in
        </Button>
      </Alert>
    );
  }
  if (code === "TOO_MANY_RETRIES") {
    return (
      <Alert severity="warning">
        <Typography>
          You exceeded the limit of retries. Please wait before trying again.
        </Typography>
      </Alert>
    );
  }
  if (code === "UNAUTHORIZED") {
    return (
      <Alert severity="error">
        <Typography>
          You&apos;re not authorized to perform this action.
        </Typography>
      </Alert>
    );
  }
  if (code === "CUSTOMER_NOT_FOUND") {
    return (
      <Alert severity="warning">
        <Typography>
          This Customer doesn&apos;t exist or has been deleted.
        </Typography>
        <Button color="inherit" onClick={toCustomers}>
          Back
        </Button>
      </Alert>
    );
  }
  if (code === "DUPLICATED_CUSTOMER") {
    return (
      <Alert severity="error">
        <Typography>This Customer&apos;s email already exists</Typography>
      </Alert>
    );
  }

  if (code === "REQUIRED_EMAIL") {
    return (
      <Alert severity="error">
        <Typography>The field email is required</Typography>
      </Alert>
    );
  }

  if (code === "REQUIRED_TAX_ID") {
    return (
      <Alert severity="error">
        <Typography>The field Tax ID is required</Typography>
      </Alert>
    );
  }

  if (code === "REQUIRED_COMPANY_NAME") {
    return (
      <Alert severity="error">
        <Typography>The field Company Name is required</Typography>
      </Alert>
    );
  }

  if (code === "REQUIRED_COMPANY_ADDRESS") {
    return (
      <Alert severity="error">
        <Typography>The field Company Address is required</Typography>
      </Alert>
    );
  }

  if (code === "REQUIRED_CITY") {
    return (
      <Alert severity="error">
        <Typography>The field City is required</Typography>
      </Alert>
    );
  }

  if (code === "REQUIRED_STREET") {
    return (
      <Alert severity="error">
        <Typography>The field Street is required</Typography>
      </Alert>
    );
  }

  if (code === "REQUIRED_NUMBER") {
    return (
      <Alert severity="error">
        <Typography>The field Number is required</Typography>
      </Alert>
    );
  }

  if (code === "REQUIRED_POSTCODE") {
    return (
      <Alert severity="error">
        <Typography>The field Postcode is required</Typography>
      </Alert>
    );
  }

  return (
    <Alert severity="error">
      <Typography>Internal error</Typography>
    </Alert>
  );
};

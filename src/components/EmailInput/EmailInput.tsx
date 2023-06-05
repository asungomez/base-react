import { AccountCircle } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { FC } from "react";

type EmailInputProps = {
  value?: string;
  onChange?: (event: { target: { value: string; name: string } }) => void;
  errorMessage?: string | null;
  name?: string;
  withAdornment?: boolean;
};

export const EmailInput: FC<EmailInputProps> = ({
  value,
  onChange,
  errorMessage,
  name = "email",
  withAdornment = true,
}) => {
  const changeHandler: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (event) => {
    if (onChange) {
      onChange(event);
    }
  };
  return (
    <TextField
      label="Email"
      name={name}
      variant="outlined"
      value={value}
      margin="normal"
      onChange={changeHandler}
      error={!!errorMessage}
      helperText={errorMessage}
      InputProps={{
        startAdornment: withAdornment ? (
          <InputAdornment position="start">
            <AccountCircle />
          </InputAdornment>
        ) : undefined,
      }}
    />
  );
};

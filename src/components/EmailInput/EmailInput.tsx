import { AccountCircle } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { FC } from "react";

type EmailInputProps = {
  value?: string;
  onChange?: (email: string) => void;
  errorMessage?: string | null;
  name?: string;
};

export const EmailInput: FC<EmailInputProps> = ({
  value,
  onChange,
  errorMessage,
  name = "email",
}) => {
  const changeHandler: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (event) => {
    if (onChange) {
      onChange(event.target.value);
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
        startAdornment: (
          <InputAdornment position="start">
            <AccountCircle />
          </InputAdornment>
        ),
      }}
    />
  );
};

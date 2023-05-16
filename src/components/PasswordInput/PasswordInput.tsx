import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { FC, useState } from "react";

type PasswordInputProps = {
  onChange?: (password: string) => void;
  value?: string;
  label?: string;
  name?: string;
  errorMessage?: string | null;
};

export const PasswordInput: FC<PasswordInputProps> = ({
  onChange,
  value,
  label = "Password",
  name = "password",
  errorMessage,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const changeHandler: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (event) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  const togglePasswordVisibility = () => setShowPassword((show) => !show);

  return (
    <TextField
      label={label}
      name={name}
      variant="outlined"
      value={value}
      type={showPassword ? "text" : "password"}
      margin="normal"
      onChange={changeHandler}
      error={!!errorMessage}
      helperText={errorMessage}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Lock />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "hide password" : "show password"}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

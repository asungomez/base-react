import { Button } from "@mui/material";
import { FC } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { VisuallyHiddenInput } from "./UploadFileButton.style";

type UploadFileButtonProps = {
  onChange: (fileUrl: string) => void;
  label: string;
  style?: React.CSSProperties;
};

export const UploadFileButton: FC<UploadFileButtonProps> = ({
  onChange,
  label,
  style,
}) => {
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      style={style}
    >
      {label}
      <VisuallyHiddenInput type="file" onChange={changeHandler} />
    </Button>
  );
};

import { FC, useState } from "react";
import { UploadFileButton } from "../UploadFileButton/UploadFileButton";
import { ImageDisplay } from "./ImagePicker.style";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export type ImagePickerProps = {
  value?: string;
  onChange: (value: File | null) => void;
};

export const ImagePicker: FC<ImagePickerProps> = ({ value, onChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleDelete = () => onChange(null);
  if (value) {
    return (
      <ImageDisplay
        image={value}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <UploadFileButton
          onChange={onChange}
          label="Change image"
          style={{ display: isHovered ? "inline-block" : "none" }}
        />
        <Button
          variant="contained"
          startIcon={<DeleteIcon />}
          style={{ display: isHovered ? "inline-block" : "none" }}
          color="error"
          sx={{ ml: 1 }}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </ImageDisplay>
    );
  }
  return <UploadFileButton onChange={onChange} label="Add image" />;
};

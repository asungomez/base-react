import { Card } from "@mui/material";
import { styled } from "@mui/system";

export const ImageDisplay = styled(Card)<{ image?: string }>(({ image }) => ({
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "300px",
  backgroundImage: image ? `url(${image})` : "none",
  backgroundSize: "cover",
  backgroundPosition: "center",
  "&:hover": {
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1,
    },
  },
  "& > *": {
    position: "relative",
    zIndex: 2,
  },
}));

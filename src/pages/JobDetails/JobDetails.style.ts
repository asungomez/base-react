import styledComponents from "styled-components";

export const JobImageWrapper = styledComponents.div({
  width: "100%",
  maxHeight: "300px",
  margin: "20px",
});

export const JobImage = styledComponents.img({
  maxHeight: "300px",
  objectFit: "contain",
  borderRadius: "8px",
});

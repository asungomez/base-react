import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { FC } from "react";
import { DeleteCustomerExternalLinkButton } from "../DeleteCustomerExternalLinkButton/DeleteCustomerExternalLinkButton";
import { ErrorCode } from "../../services/error";

type CustomerExternalLinkProps = {
  url: string;
  customerId: string;
  index: number;
};
export const CustomerExternalLink: FC<CustomerExternalLinkProps> = ({
  url,
  customerId,
  index,
}) => {
  const deleteErrorHandler = (error: ErrorCode) => {
    console.error(error);
  };
  return (
    <ListItem
      secondaryAction={
        <DeleteCustomerExternalLinkButton
          onDeleteError={deleteErrorHandler}
          customerId={customerId}
          index={index}
        />
      }
    >
      <ListItemButton component="a" href={url} target="_blank">
        <ListItemText primary={url} />
      </ListItemButton>
    </ListItem>
  );
};

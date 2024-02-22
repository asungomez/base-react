import { IconButton } from "@mui/material";
import { FC } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDeleteCustomerExternalLink } from "../../hooks/customers/external-links/useDeleteCustomerExternalLink";
import { ErrorCode } from "../../services/error";

type DeleteCustomerExternalLinkButtonProps = {
  customerId: string;
  index: number;
  onDeleteError: (error: ErrorCode) => void;
};

export const DeleteCustomerExternalLinkButton: FC<
  DeleteCustomerExternalLinkButtonProps
> = ({ customerId, index, onDeleteError }) => {
  const { loading, error, deleteExternalLink } =
    useDeleteCustomerExternalLink(customerId);

  const deleteHandler = () => {
    deleteExternalLink(index).catch(() => {
      if (error) {
        onDeleteError(error);
      }
    });
  };

  return (
    <IconButton
      edge="end"
      aria-label="delete"
      onClick={deleteHandler}
      disabled={loading}
    >
      <DeleteIcon />
    </IconButton>
  );
};

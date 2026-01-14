import { FC } from "react";
import { Button } from "@mui/material";
import { ErrorCode } from "../../services/error";
import { useDeleteCustomer } from "../../hooks/customers/useDeleteCustomer";

type DeleteCustomerButtonProps = {
  customerId: string;
  onDelete: () => void;
  onError: (code: ErrorCode) => void;
};

export const DeleteCustomerButton: FC<DeleteCustomerButtonProps> = ({
  customerId,
  onDelete,
  onError,
}) => {
  const { deleteCustomer, loading } = useDeleteCustomer(customerId);
  const deleteHandler = () => {
    deleteCustomer()
      .then(() => {
        onDelete();
      })
      .catch((error) => {
        onError(error);
      });
  };
  return (
    <Button
      variant="contained"
      color="error"
      onClick={deleteHandler}
      loading={loading}
    >
      Delete
    </Button>
  );
};

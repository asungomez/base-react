import { FC } from "react";
import { LoadingButton } from "@mui/lab";
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
    <LoadingButton
      variant="contained"
      color="error"
      onClick={deleteHandler}
      loading={loading}
    >
      Delete
    </LoadingButton>
  );
};

import { LoadingButton } from "@mui/lab";
import { FC } from "react";
import { ErrorCode } from "../../services/error";
import { useDeleteCustomerMainAddress } from "../../hooks/customers/main-address/useDeleteCustomerMainAddress";

type DeleteCustomerMainAddressButtonProps = {
  customerId: string;
  onDelete: () => void;
  onError: (code: ErrorCode) => void;
};

export const DeleteCustomerMainAddressButton: FC<
  DeleteCustomerMainAddressButtonProps
> = ({ customerId, onDelete, onError }) => {
  const { deleteCustomerMainAddress, loading, error } =
    useDeleteCustomerMainAddress(customerId);

  const clickHander = () => {
    deleteCustomerMainAddress()
      .then(() => {
        onDelete();
      })
      .catch(() => {
        if (error) {
          onError(error);
        }
      });
  };
  return (
    <LoadingButton
      variant="contained"
      color="error"
      onClick={clickHander}
      loading={loading}
    >
      Delete
    </LoadingButton>
  );
};

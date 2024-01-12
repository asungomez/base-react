import { LoadingButton } from "@mui/lab";
import { FC } from "react";
import { ErrorCode } from "../../services/error";
import { useDeleteCustomerTaxData } from "../../hooks/useDeleteCustomerTaxData";

type DeleteCustomerTaxDataButtonProps = {
  customerId: string;
  onDelete: () => void;
  onError: (code: ErrorCode) => void;
};

export const DeleteCustomerTaxDataButton: FC<
  DeleteCustomerTaxDataButtonProps
> = ({ customerId, onDelete, onError }) => {
  const { deleteCustomerTaxData, loading } =
    useDeleteCustomerTaxData(customerId);

  const clickHander = () => {
    deleteCustomerTaxData()
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
      onClick={clickHander}
      loading={loading}
    >
      Delete
    </LoadingButton>
  );
};
